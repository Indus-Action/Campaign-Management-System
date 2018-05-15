from rest_framework import viewsets, generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from django.contrib.auth.models import User
from django.utils.crypto import get_random_string
from django.db.models import Q
from django.http import StreamingHttpResponse

from tasks.pagination import TaskPageNumberPagination
from tasks.serializers import TaskSerializer, TaskListTaskSerializer
from tasks.models import Task
from task_status.models import TaskStatus
from task_types.models import TaskType
from forms.models import Form, FormData, PersistentForm, PersistentFormData
from user_profiles.models import UserProfile

import csv
from collections import OrderedDict
from datetime import timedelta, datetime, date


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.order_by('created_at')
    serializer_class = TaskSerializer

    def perform_create(self, serializer):
        task_type = TaskType.objects.get(pk=self.request.data['task_type'])
        sla = task_type.sla

        if 'start_date' in self.request.data.keys():
            due_date = datetime.strptime(self.request.data['start_date'], '%Y-%m-%d').date() + timedelta(hours=sla)
            serializer.save(creator=self.request.user,
                            due_date=due_date)

        return super(TaskViewSet, self).perform_create(serializer)


    def update(self, request, pk):
        try:
            task = Task.objects.get(pk = pk)
            data = request.data
            user_task = None

            if 'status' in data.keys():
                current_task_status = task.status
                request_task_status = TaskStatus.objects.get(pk = data['status'])

                if(current_task_status != request_task_status):
                    task.status = request_task_status
                    task.save()


            if('task_type' in data.keys()):
                current_task_type = task.task_type
                request_task_type = TaskType.objects.get(id = data['task_type'])


                if(current_task_type != request_task_type):
                    task_not_done_status = TaskStatus.objects.get(status ='Call Not Done')
                    task_done_status = TaskStatus.objects.get(status ='Call Done')
                    task.status = task_done_status
                    task.save()
                    user_task = Task.objects.create(beneficiary = task.beneficiary,
                                 task_type = request_task_type,
                                 assignee = task.assignee,
                                 status = task_not_done_status, mobile = task.mobile)

            if('assignee' in data.keys()):

                request_assignee = User.objects.get(id = data['assignee'])
                update_assignee = False
                if(task.assignee is not None):

                    current_assignee = task.assignee
                    if(current_assignee != request_assignee):
                        update_assignee = True
                else:
                    update_assignee = True
                if(update_assignee):
                    task.assignee = request_assignee
                    task.save()

            if('form_data' in data.keys()):
                request_form_data = FormData.objects.get(id = data['form_data'])
                update_form_data = False
                if(task.form_data is not None):
                    current_form_data = task.form_data
                    if(current_form_data != request_form_data):
                        update_form_data = True
                else:
                    update_form_data = True
                if(update_form_data):
                    task.form_data = request_form_data
                    task.save()
            return Response(data = {'status': 'ok'}, status=status.HTTP_202_ACCEPTED)

        except Task.DoesNotExist:
            return Response(data = {'Error':'Task not found'}, status = status.HTTP_404_NOT_FOUND)
        except Exception as exception:
            return Response(data = {'Error':str(exception.args)}, status = status.HTTP_400_BAD_REQUEST)

class PaginatedTaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.order_by('created_at')
    serializer_class = TaskListTaskSerializer
    pagination_class = TaskPageNumberPagination


class BeneficiaryTasksView(generics.ListAPIView):
    serializer_class = TaskSerializer

    def get(self, request, user_pk=None):
        queryset = Task.objects.filter(beneficiary=user_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


class PledgedTasksView(generics.ListAPIView):
    serializer_class = TaskListTaskSerializer
    pagination_class = TaskPageNumberPagination

    def get(self, request, user_pk=None):
        queryset = Task.objects.filter(pledges__user__pk__in=[user_pk])
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


class AssignedTasksView(generics.ListAPIView):
    serializer_class = TaskSerializer

    def get(self, request, user_pk=None):
        queryset = Task.objects.filter(Q(assignee=user_pk) | Q(party__pk__in=user_pk))
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


class CreatedTasksView(generics.ListAPIView):
    serializer_class = TaskSerializer

    def get(self, request, user_pk=None):
        queryset = Task.objects.filter(creator=user_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


class InterestTasksView(generics.ListAPIView):
    serializer_class = TaskSerializer

    def get(self, request, interest_pk=None):
        queryset = Task.objects.filter(interests__pk__in=interest_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


class FilterTasksView(generics.ListAPIView):
    serializer_class = TaskListTaskSerializer
    pagination_class = TaskPageNumberPagination
    paginate_by = 50

    @staticmethod
    def filter_tasks(request):
        args_dict = dict(request.GET.iterlists())
        queries = []
        query = None
        queryset = None

        for key in args_dict.keys():
            if key != 'page':
                if key == 'due_date' or key == 'due_date__lt':
                    queries.append(Q(**{key: date.today()}))
                elif key == 'status__category__task_completed_flag__in':
                    queries.append(Q(**{key: [str(v) for v in args_dict[key]]}))
                else:
                    queries.append(Q(**{key: [int(str(v)) for v in args_dict[key]]}))

        if queries:
            query = queries.pop()

        for item in queries:
            query &= item

        if query:
            queryset = Task.objects.filter(query)
        else:
            queryset = Task.objects.all()

        if queryset:
            queryset = queryset.order_by('due_date')

        return queryset

    def get(self, request):
        queryset = self.filter_tasks(request).order_by('?')

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

@api_view(['GET'])
def get_filtered_tasks_length(request):
    tasks = FilterTasksView.filter_tasks(request)

    return Response({'length': tasks.count()}, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_tasks_length(request):
    return Response({'length': Task.objects.count()}, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_tasks_page_size(request):
    return Response({'page_size': TaskPageNumberPagination.page_size}, status=status.HTTP_200_OK)


@api_view(['POST'])
def create_task(request):

    try:
        data=request.data

        task_status=TaskStatus.objects.get(pk=data['task_status'])
        task_type=TaskType.objects.get(pk=data['task_type'])
        mobile=data['mobile']
        assignee=User.objects.get(pk=data['assignee'])

        user_profile=UserProfile.objects.create(mobile=data['mobile'])
        user=User.objects.create(username=mobile)
        user_profile.user=user
        user_profile.save()

        task = Task.objects.create(task_type=task_type,
                                                       status=task_status,
                                                       beneficiary=user_profile.user,
                                                       assignee=assignee,mobile=mobile)



        return Response({'status': 'ok'}, status.HTTP_200_OK)

    except Exception as exception:

        return Response({'status': 'Failed','error':str(exception.args)}, status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def create_bulk_tasks(request):
    data = request.data

    task_status = TaskStatus.objects.get(pk=data['task_status'])
    task_type = TaskType.objects.get(pk=data['task_type'])
    number_of_tasks = 0
    users = []
    task_beneficiaries = []
    random_assign = data['random_assign']
    assignee_type = data['assignee_type']

    if 'number_of_tasks' in data.keys():
        number_of_tasks = int(data['number_of_tasks'])
        new_user_profile = None
        new_user = None

        for i in range(0, number_of_tasks):
            unique_random_number_found = False

            while not unique_random_number_found:
                random_number = get_random_string(10)
                new_user_profile, created = UserProfile.objects.get_or_create(mobile=random_number)
                if created:
                    unique_random_number_found = True
                    new_user = User.objects.create(username=new_user_profile.mobile)
                    new_user_profile.user = new_user
                    new_user_profile.save()
                    break
                else:
                    new_user = new_user_profile.user

            # TODO: Add scope for persistent data addition
            task_beneficiaries.append(new_user)
    elif 'users' in data.keys():
        users = data['users']

        for user in users:
            new_user_profile, created = UserProfile.objects.get_or_create(mobile=user)
            new_user = new_user_profile.user

            if created:
                new_user = User.objects.create(username=user)
                # TODO: Add scope for persistent data addition
                new_user_profile.user = new_user
                new_user_profile.save()

            task_beneficiaries.append(new_user)

    try:
        number_of_tasks = len(task_beneficiaries)
        for i in range(0, number_of_tasks):
            try:
                t = Task.objects.get(task_type=task_type,
                                     beneficiary=task_beneficiaries[i])

                if t.status.category.category == 'DONE':
                    Task.objects.create(task_type=task_type,
                                        beneficiary=task_beneficiaries[i],
                                        status=task_status)
                else:
                    t.status = task_status
                    t.save()
            except:
                t = Task.objects.create(task_type=task_type,
                                    beneficiary=task_beneficiaries[i],
                                    status=task_status)

            if random_assign and assignee_type:
                try:
                    assignee = User.objects.filter(profile__user_type=assignee_type).order_by('?').first()
                    t.assignee = assignee
                    t.save()
                except:
                    pass

        return Response(status=status.HTTP_200_OK)
    except Exception, e:
        return Response({'Error': 'Something is missing.'},
                        status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def tasks_assign(request):
    data = request.data

    if data['tasks'] and data['users'] and (data['equal_splits'] or data['splits']):
        user_splits = {}
        assigned_tasks = {}
        tasks = []

        for task in data['tasks']:
            tasks.append(task['id'])

        for user in data['users']:
            if data['equal_splits']:
                user_splits[user] = 1.0/len(data['users']);
            else:
                user_splits[user] = data['splits'][user]


        for user in data['users']:
            u = User.objects.get(pk=user)
            count = 0

            for task in tasks:
                if count < len(data['tasks']) * user_splits[user] and task not in assigned_tasks.keys():
                    t = Task.objects.get(pk=task)
                    t.assignee = u
                    count += 1
                    t.save()
                    assigned_tasks[task] = True

        return Response(status=status.HTTP_200_OK)
    else:
        return Response({'Error': 'Something is missing.'},
                        status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def tasks_smart_assign(request):
    data = request.data
    stages = []
    task_status = []
    task_status_categories = []
    task_types = []
    tags = []
    assignees = []

    if 'stages' in data.keys():
        stages = data['stages']

    if 'task_status' in data.keys():
        task_status = data['task_status']

    if 'task_status_categories' in data.keys():
        task_status_categories = data['task_status_categories']

    if 'task_types' in data.keys():
        task_types = data['task_types']

    if 'tags' in data.keys():
        tags = data['tags']

    if 'assignees' in data.keys():
        assignees = data['assignees']

    tasks = Task.objects.filter(beneficiary__profile__stage__pk__in=stages,
                                status__pk__in=task_status,
                                status__category__pk__in=task_status_categories,
                                task_type__pk__in=task_types,
                                beneficiary__tags__pk__in=tags,
                                assignee__pk__in=assignees)

    if data['users'] and (data['equal_splits'] or data['splits']):
        user_splits = {}
        assigned_tasks = {}

        for user in data['users']:
            if data['equal_splits']:
                user_splits[user] = 1.0/len(data['users']);
            else:
                user_splits[user] = data['splits'][user]

        for user in data['users']:
            u = User.objects.get(pk=user)
            count = 0

            for task in tasks:
                if count < len(tasks) * user_splits[user] and task.id not in assigned_tasks.keys():
                    t.assignee = u
                    count += 1
                    t.save()
                    assigned_tasks[task] = True

        return Response(status=status.HTTP_200_OK)
    else:
        return Response({'Error': 'Something is missing.'},
                        status=status.HTTP_400_BAD_REQUEST)

class Echo(object):
    """An object that implements just the write method of the file-like
    interface.
    """
    def write(self, value):
        """Write the value by returning it, instead of storing in a buffer."""
        return value


@api_view(['POST'])
def import_data_view(request):
    data = request.data['data']
    persistent_form = PersistentForm.objects.last()
    success_task_status = None
    failure_task_status = None


    if 'success_task_status' in request.data.keys():
        success_task_status = TaskStatus.objects.get(pk=int(request.data['success_task_status']))

    if 'failure_task_status' in request.data.keys():
        failure_task_status = TaskStatus.objects.get(pk=int(request.data['failure_task_status']))

    for row in data:
        created = False
        profile = None
        user = None
        task = None
        form_data = None
        form = None
        persistent_form_data = None

        if 'unique_id' in row.keys() or 'beneficiary_mobile' in row.keys():
            try:
                profile = UserProfile.objects.get(mobile=row['unique_id'])
                user = profile.user

                if 'unique_id' in row.keys() and 'beneficiary_mobile' in row.keys() and row['unique_id'] != row['beneficiary_mobile']:
                    profile.mobile = row['beneficiary_mobile']
                    profile.save()
            except:
                try:
                    profile, created = UserProfile.objects.get_or_create(mobile=row['beneficiary_mobile'])
                    if created:
                        user = User.objects.create(username=profile.mobile)
                        profile.user = user

                    if 'unique_id' in row.keys() and 'beneficiary_mobile' in row.keys() and row['unique_id'] != row['beneficiary_mobile']:
                        profile.mobile = row['beneficiary_mobile']

                    profile.save()
                    user = profile.user
                except:
                    continue

            if 'task_id' in row.keys():
                try:
                    task = Task.objects.get(pk=row['task_id'])
                    form_data = task.form_data
                    form = form_data.form

                    if 'unique_id' in row.keys() and 'beneficiary_mobile' in row.keys() and row['unique_id'] != row['beneficiary_mobile']:
                        try:
                            UserProfile.objects.get(mobile=row['beneficiary_mobile'])

                            if failure_task_status:
                                task.status = failure_task_status
                                task.save()
                        except:
                            pass
                except:
                    pass
            try:
                persistent_form_data, persistent_data_created = PersistentFormData.objects.get_or_create(beneficiary=user, form=persistent_form)
            except Exception, e:
                pass

            for key in row.keys():
                if persistent_form:
                    for field in persistent_form.schema:
                        if field['title'] == key:
                            persistent_form_data.data[key] = row[key]
                            break
                if form:
                    for field in form.schema:
                        if field['title'] == key:
                            form_data.data[key] = row[key]
                            break


            if persistent_form_data:
                persistent_form_data.save()
            if form_data:
                form_data.save()

            if task and success_task_status:
                task.status = success_task_status
                task.save()

    return Response(status=status.HTTP_200_OK)


@api_view(['GET'])
def export_tasks_view(request):
    tasks = FilterTasksView.filter_tasks(request)

    header = ['task_id', 'beneficiary_mobile', 'unique_id', 'form_id', 'current_task_status']
    persistent_form = PersistentForm.objects.last()

    args_dict = dict(request.GET.iterlists())

    task_types = []

    if 'task_types__in' in args_dict.keys():
        task_types = args_dict['task_types__in']
        task_types = TaskType.objects.filter(task_type__in=task_types)
    else:
        for task in tasks:
            task_type = task.task_type

            if task_type not in task_types:
                task_types.append(task_type)

    for task_type in task_types:
        form_fields = task_type.form.schema
        for field in form_fields:
            header.append(field['title'])

    form_fields = persistent_form.schema
    for field in form_fields:
        header.append(field['title'])

    ordered_header = OrderedDict()

    for key in header:
        ordered_header[key] = None

    rows = []
    rows.append(ordered_header.keys())

    for task in tasks:
        task_dict = OrderedDict()
        form_data = {}
        persistent_data = {}

        try:
            form_data = task.form_data.data
            persistent_data = task.beneficiary.persistent_data.data
        except:
            pass

        task_dict['task_id'] = task.id
        task_dict['unique_id'] = task.beneficiary.profile.mobile
        task_dict['beneficiary_mobile'] = task.beneficiary.profile.mobile
        task_dict['form_id'] = task.task_type.form.id
        task_dict['current_task_status'] = task.status.id

        for key in ordered_header:
            if key in persistent_data.keys():
                task_dict[key] = persistent_data[key]
            elif key in form_data.keys():
                task_dict[key] = form_data[key]
            else:
                if key not in task_dict.keys():
                    task_dict[key] = ''

        rows.append([task_dict[key] for key in task_dict.keys()])

    pseudo_buffer = Echo()

    writer = csv.writer(pseudo_buffer)

    filename = ('vms2' + str(datetime.now()) + '.csv').replace(' ', '_')

    response = StreamingHttpResponse((writer.writerow(row) for row in rows),
                                     content_type="text/csv")
    response['Content-Disposition'] = 'attachment; filename="' + filename + '"'

    return response
