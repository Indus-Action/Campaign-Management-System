from rest_framework import views, status, viewsets
from rest_framework.response import Response

from django.contrib.auth.models import User
from django.db.models import Q

from user_profiles.models import UserProfile
from events.models import Event
from event_conditions.models import EventCondition
from exotel.models import Exotel
from tasks.models import Task
from task_types.models import TaskType
from user_profiles.models import UserProfile
from task_status.models import TaskStatus
from forms.models import PersistentFormData
from tags.models import Tag
from stages.models import Stage
import datetime
from exotel.serializers import ExotelSerializer

from vms2.settings.base import get_env_variable

import sys
import re
import requests


class IncSMS(views.APIView):
    def get(self, request, format=None):
        mobile = request.GET.get('From')
        body = request.GET.get('Body')
        users = []

        if mobile:
            if len(mobile) == 11:
                mobile = mobile[1:]

            user_profiles = list(UserProfile.objects.filter(Q(mobile=mobile) | Q(alt_mobile__contains=[mobile])))

            app_ids = re.findall('\d{11}', body)
            pfs = PersistentFormData.objects.filter(beneficiary__profile__in=user_profiles)
            for pf in pfs:
                data = pf.data
                data['application_ids'] = app_ids
                pf.data = data
                pf.save()

        return Response(headers={'Content-Type': 'text/plain', 'Content-Length': 0}, content_type="text/plain", status=status.HTTP_200_OK)

class DostPaid(views.APIView):
    def get(self, request, format=None):
        sid = get_env_variable('EXOTEL_SID')
        token = get_env_variable('EXOTEL_TOKEN')
        mobile = request.GET.get('From')
        user = None

        if mobile:
            if len(mobile) == 11:
                mobile = mobile[1:]

            user_created = False

            user_profiles = list(UserProfile.objects.filter(Q(mobile=mobile) | Q(alt_mobile__contains=[mobile])))

            if len(user_profiles) > 0:
                for user_profile in user_profiles:
                    if not hasattr(user_profile, 'user'):
                        user, created = User.objects.get_or_create(username=user_profile.mobile)
                        user_profile.user = user
                        user_profile.save()
            else:
                user_profile = UserProfile.objects.create(mobile=mobile)
                user = User.objects.create(username=mobile)
                user_profile.user = user
                user_profile.save()
                user_created = True

                user_profiles.append(user_profile)

            for user_profile in user_profiles:
                user_profile.number_of_missed_calls += 1

                exotel, exotel_created = Exotel.objects.get_or_create()

                if exotel:
                    task_type = TaskType.objects.get(task_type="Dost Paid")
                    task_status = exotel.default_task_status

                    task_create_flag = True

                    if user_created:
                        task = Task.objects.create(task_type=task_type,
                                                   status=task_status,
                                                   beneficiary=user_profile.user)
                        task_create_flag = False

                    if task_create_flag:
                        already_existing_tasks = Task.objects.filter(Q(task_type=task_type) &
                                                                     ~Q(status__category__task_completed_flag='DONE') &
                                                                     Q(beneficiary=user_profile.user))

                        for task in already_existing_tasks:
                            if task.status.category.task_completed_flag == 'TODO':
                                task.status = task_status
                                task.save()

                        if len(already_existing_tasks) == 0:
                            Task.objects.create(status=task_status,
                                                task_type=task_type,
                                                beneficiary=user_profile.user)

            return Response({'status': 'ok'}, status.HTTP_200_OK)

        return Response({'status': 'not ok'}, status.HTTP_400_BAD_REQUEST)


class DostMother(views.APIView):
    def get(self, request, format=None):
        sid = get_env_variable('EXOTEL_SID')
        token = get_env_variable('EXOTEL_TOKEN')
        mobile = request.GET.get('From')
        user = None

        if mobile:
            if len(mobile) == 11:
                mobile = mobile[1:]

            user_created = False

            user_profiles = list(UserProfile.objects.filter(Q(mobile=mobile) | Q(alt_mobile__contains=[mobile])))

            if len(user_profiles) > 0:
                for user_profile in user_profiles:
                    if not hasattr(user_profile, 'user'):
                        user, created = User.objects.get_or_create(username=user_profile.mobile)
                        user_profile.user = user
                        user_profile.save()
            else:
                user_profile = UserProfile.objects.create(mobile=mobile)
                user = User.objects.create(username=mobile)
                user_profile.user = user
                user_profile.save()
                user_created = True

                user_profiles.append(user_profile)

            for user_profile in user_profiles:
                user_profile.number_of_missed_calls += 1

                exotel, exotel_created = Exotel.objects.get_or_create()

                if exotel:
                    task_type = TaskType.objects.get(task_type="Dost Mother")
                    task_status = exotel.default_task_status

                    task_create_flag = True

                    if user_created:
                        task = Task.objects.create(task_type=task_type,
                                                   status=task_status,
                                                   beneficiary=user_profile.user)
                        task_create_flag = False

                    if task_create_flag:
                        already_existing_tasks = Task.objects.filter(Q(task_type=task_type) &
                                                                     ~Q(status__category__task_completed_flag='DONE') &
                                                                     Q(beneficiary=user_profile.user))

                        for task in already_existing_tasks:
                            if task.status.category.task_completed_flag == 'TODO':
                                task.status = task_status
                                task.save()

                        if len(already_existing_tasks) == 0:
                            Task.objects.create(status=task_status,
                                                task_type=task_type,
                                                beneficiary=user_profile.user)

            return Response({'status': 'ok'}, status.HTTP_200_OK)

        return Response({'status': 'not ok'}, status.HTTP_400_BAD_REQUEST)

class DostFather(views.APIView):
    def get(self, request, format=None):
        sid = get_env_variable('EXOTEL_SID')
        token = get_env_variable('EXOTEL_TOKEN')
        mobile = request.GET.get('From')
        user = None

        if mobile:
            if len(mobile) == 11:
                mobile = mobile[1:]

            user_created = False

            user_profiles = list(UserProfile.objects.filter(Q(mobile=mobile) | Q(alt_mobile__contains=[mobile])))

            if len(user_profiles) > 0:
                for user_profile in user_profiles:
                    if not hasattr(user_profile, 'user'):
                        user, created = User.objects.get_or_create(username=user_profile.mobile)
                        user_profile.user = user
                        user_profile.save()
            else:
                user_profile = UserProfile.objects.create(mobile=mobile)
                user = User.objects.create(username=mobile)
                user_profile.user = user
                user_profile.save()
                user_created = True

                user_profiles.append(user_profile)

            for user_profile in user_profiles:
                user_profile.number_of_missed_calls += 1

                exotel, exotel_created = Exotel.objects.get_or_create()

                if exotel:
                    task_type = TaskType.objects.get(task_type="Dost Father")
                    task_status = exotel.default_task_status

                    task_create_flag = True

                    if user_created:
                        task = Task.objects.create(task_type=task_type,
                                                   status=task_status,
                                                   beneficiary=user_profile.user)
                        task_create_flag = False

                    if task_create_flag:
                        already_existing_tasks = Task.objects.filter(Q(task_type=task_type) &
                                                                     ~Q(status__category__task_completed_flag='DONE') &
                                                                     Q(beneficiary=user_profile.user))

                        for task in already_existing_tasks:
                            if task.status.category.task_completed_flag == 'TODO':
                                task.status = task_status
                                task.save()

                        if len(already_existing_tasks) == 0:
                            Task.objects.create(status=task_status,
                                                task_type=task_type,
                                                beneficiary=user_profile.user)

            return Response({'status': 'ok'}, status.HTTP_200_OK)

        return Response({'status': 'not ok'}, status.HTTP_400_BAD_REQUEST)


class Lottery(views.APIView):
    def get(self, request, format=None):
        sid = get_env_variable('EXOTEL_SID')
        token = get_env_variable('EXOTEL_TOKEN')
        mobile = request.GET.get('From')
        choice = request.GET.get('choice')
        user = None

        if mobile:
            if len(mobile) == 11:
                mobile = mobile[1:]

            user_created = False

            user_profiles = list(UserProfile.objects.filter(Q(mobile=mobile) | Q(alt_mobile__contains=[mobile])))

            if len(user_profiles) > 0:
                for user_profile in user_profiles:
                    if not hasattr(user_profile, 'user'):
                        user, created = User.objects.get_or_create(username=user_profile.mobile)
                        user_profile.user = user
                        user_profile.save()
            else:
                user_profile = UserProfile.objects.create(mobile=mobile)
                user = User.objects.create(username=mobile)
                user_profile.user = user
                user_profile.save()
                user_created = True

                user_profiles.append(user_profile)

            for user_profile in user_profiles:
                user_profile.number_of_missed_calls += 1

                exotel, exotel_created = Exotel.objects.get_or_create()

                if exotel:
                    Tag.objects.get(tag='IVR Responses').users.add(user_profile.user)
                    if choice == '1':
                        Tag.objects.get(tag='Lottery Success').users.add(user_profile.user)
                        # Tag.objects.get(tag='C Cube Fellow').users.add(user_profile.user)
                        ups = UserProfile.objects.filter(mobile=user_profile.mobile)
                        ups.update(stage=Stage.objects.get(name='Lottery Success'))
                    elif choice == '2':
                        Tag.objects.get(tag='Lottery Failure').users.add(user_profile.user)
                        Tag.objects.get(tag='Lottery 1 Failure').users.add(user_profile.user)
                        ups = UserProfile.objects.filter(mobile=user_profile.mobile)
                        ups.update(stage=Stage.objects.get(name='Applied'))
                    elif choice == '3':
                        r = requests.get('http://52.76.48.223/api/v1/missedcall/?From=' + str(user_profile.mobile))

            return Response({'status': 'ok'}, status.HTTP_200_OK)

        return Response({'status': 'not ok'}, status.HTTP_400_BAD_REQUEST)


class MissedCall(views.APIView):
    def getPreferredAssignee(self):
        exotel, created = Exotel.objects.get_or_create()
        preferred_assignee = None

        if exotel and exotel.auto_assign:
            task_type = exotel.default_task_type
            task_status = exotel.default_task_status

            users = UserProfile.objects.filter(user_type='SS')

            min_tasks = sys.maxint

            for user in users:
                tasks = task_type.tasks.filter(status=task_status, assignee=user.user)

                if len(tasks) < min_tasks:
                    preferred_assignee = user.user
                    min_tasks = len(tasks)

        return preferred_assignee

    def get(self, request, format=None):
        #sid = get_env_variable('EXOTEL_SID')
        #token = get_env_variable('EXOTEL_TOKEN')
        mobile = request.GET.get('From')
        user = None

        if mobile:
            if len(mobile) == 11:
                mobile = mobile[1:]

            user_created = False

            user_profiles = list(UserProfile.objects.filter(Q(mobile=mobile) | Q(alt_mobile__contains=[mobile])))

            if len(user_profiles) > 0:
                for user_profile in user_profiles:
                    if not hasattr(user_profile, 'user'):
                        user, created = User.objects.get_or_create(username=user_profile.mobile)
                        user_profile.user = user
                        user_profile.save()
            else:
                user_profile = UserProfile.objects.create(mobile=mobile)
                user = User.objects.create(username=mobile)
                user_profile.user = user
                user_profile.save()
                user_created = True

                user_profiles.append(user_profile)

            for user_profile in user_profiles:
                user_profile.number_of_missed_calls += 1

                exotel, exotel_created = Exotel.objects.get_or_create()

                if exotel:
                    task_type = exotel.default_task_type
                    task_status = exotel.default_task_status
                    stage = exotel.default_stage

                    if stage and not user_profile.stage:
                        user_profile.stage = stage

                    user_profile.save()

                    task_create_flag = True

                    if user_created:
                        task = Task.objects.create(task_type=task_type,
                                                   status=task_status,
                                                   beneficiary=user_profile.user,
                                                   assignee=self.getPreferredAssignee(),mobile=mobile)
                        task_create_flag = False

                    event_conditions = EventCondition.objects.filter((Q(stage__isnull=True) | Q(stage=user_profile.stage)) &
                                                                     (Q(event_tags__isnull=True) | Q(event_tags__in=user_profile.user.tags.all())) &
                                                                     (Q(event_condition_category='MC')))

                    for event_condition in event_conditions:
                        Event.objects.create(name='missed_call_event',
                                             event_condition=event_condition,
                                             user=user_profile.user)

                        if event_condition.hook.hook_type == 'CT':
                            task_create_flag = False

                    
                    if task_create_flag:
                        already_existing_tasks = Task.objects.filter(beneficiary=user_profile.user).filter(status=task_status)

                        if already_existing_tasks.count()==0:
                            Task.objects.create(status=task_status,
                                                task_type=task_type,
                                                beneficiary=user_profile.user,
                                                assignee=self.getPreferredAssignee(),mobile=mobile)
                        else:

                            for task in already_existing_tasks:
                                task.due_date=datetime.date.today()
                                task.save()

                        


            return Response({'status': 'ok'}, status.HTTP_200_OK)

        return Response({'status': 'not ok'}, status.HTTP_400_BAD_REQUEST)


class ExotelViewSet(viewsets.ModelViewSet):
    serializer_class = ExotelSerializer
    queryset = Exotel.objects.all()
