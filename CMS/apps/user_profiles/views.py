from django.db.models import Q
from django.shortcuts import redirect
from django.http import JsonResponse
import json
from stages.models import Stage
from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import list_route
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_auth.serializers import PasswordResetConfirmSerializer
from rest_auth.registration.views import RegisterView

from user_profiles.models import UserProfile
from user_profiles.serializers import UserSerializer
from user_profiles.permissions import *
from django.contrib.auth.models import User
from task_types.models import TaskType
from tasks.models import Task
from task_status.models import TaskStatus
# Create your views here.

class UserDetailViewSet(viewsets.ModelViewSet):
    """
    Return User list.
    """
    queryset = UserProfile.objects.all()
    serializer_class = UserSerializer


    def create(self, request):
        try:
            print "Inside creating user profile"
            userprofile = UserProfile.objects.get(
                    user__auth_token__key=request.data['token']
                )
            user = userprofile.user
            if 'first_name' in request.data.keys():
                user.first_name = request.data['first_name']
            if 'last_name' in request.data.keys():
                user.last_name = request.data['last_name']
            user.save()
            return Response(data=UserSerializer(userprofile).data, status=status.HTTP_202_ACCEPTED)
        except UserProfile.DoesNotExist:
            user = None
            return Response(data={'Error':'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, pk):
        try:
            userprofile = UserProfile.objects.get(pk=pk)
            data = request.data

            if 'mobile' in data.keys():
                userprofile.mobile = data['mobile']

            if 'user_type' in data.keys():
                userprofile.user_type = data['user_type']

            if 'stage' in data.keys():
                stage = Stage.objects.get(pk=data['stage']['id'])
                userprofile.stage = stage
                user = userprofile.user
                stage_name =userprofile.stage.name

                task_type = stage.task_type

                task = Task.objects.get(pk=data['task'])

                task_not_done_status = TaskStatus.objects.get(status='Call Not Done')
                task_done_status = TaskStatus.objects.get(status='Call Done')

                task.status = task_done_status
                task.save(force_update=True) # TODO: Remove force_update. Instead user Task.object (manager)

                user_task = Task(beneficiary=userprofile.user,
                                 task_type=task_type,
                                 assignee=task.assignee,
                                 status=task_not_done_status,
                                 mobile = userprofile.mobile)
                user_task.save(force_insert=True) # TODO: Remove force_insert. Instead user Task.object (manager)

            if 'owner' in data.keys() and data['owner']:
                user = UserProfile.objects.get(pk=data['owner']).user
                userprofile.owner = user

            userprofile.save(force_update=True)

            return Response(data={'status':'updated'}, status=status.HTTP_202_ACCEPTED)
        except UserProfile.DoesNotExist:
            userprofile = None
            return Response(data={'Error':'User not found'}, status=status.HTTP_404_NOT_FOUND)

    @list_route()
    def search(self, request):
        search_text = request.GET.get('typed')

        user_profiles = UserProfile.objects.filter(Q(mobile__contains=search_text) |
                                                   Q(user__first_name__icontains=search_text) |
                                                   Q(user__last_name__icontains=search_text) |
                                                   Q(user__email__icontains=search_text))
        serializer = self.get_serializer(user_profiles, many=True)

        return Response(serializer.data)



class UserDetailFilterViewSet(generics.ListAPIView):
    serializer_class = UserSerializer

    @staticmethod
    def filter_users(request):
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
                    queries.append(Q(**{key: [str(str(v)) for v in args_dict[key]]}))

        if queries:
            query = queries.pop()

        for item in queries:
            query &= item

        if query:
            queryset = UserProfile.objects.filter(query)
        else:
            queryset = UserProfile.objects.all()

        return queryset

    def get(self, request):
        queryset = None

        args_dict = dict(request.GET.iterlists())
        queries = []
        query = None
        queryset = None
        user_type=args_dict['user_type']

        for key in args_dict.keys():
            if key != 'page':
                if key == 'due_date' or key == 'due_date__lt':
                    queries.append(Q(**{key: date.today()}))
                elif key == 'status__category__task_completed_flag__in':
                    queries.append(Q(**{key: [str(v) for v in args_dict[key]]}))
                else:
                    queries.append(Q(**{key: args_dict[key]}))

        if queries:
            query = queries.pop()

        for item in queries:
            query &= item

        if query:
            queryset = UserProfile.objects.filter(user_type=str(user_type[0]))
        else:
            queryset = UserProfile.objects.all()

        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)



class CustomUserDetailsView(APIView):
    serializer_class = UserSerializer

    def get(self, request, token, format=None):
        data = UserProfile.objects.get(user__auth_token__key=token)
        serializer = UserSerializer(data)
        return Response(serializer.data)


class CustomRegisterView(RegisterView):
    def create(self, request, *args, **kwargs):

        if 'mobile' not in request.data.keys() or len(str(request.data['mobile']))==0:
            return Response({'Error':'Mobile number is required for the request.'},
                    status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        user = self.perform_create(serializer)


        try:
            profile = UserProfile.objects.get(mobile=request.data['mobile'])
            user.profile.mobile = profile.mobile
            profile.delete()
            user.profile.save()
        except:
            user.profile.mobile = request.data['mobile']
            user.profile.user_type='SS'
            user.profile.save()

        headers = self.get_success_headers(serializer.data)

        return Response(self.get_response_data(user),
                status=status.HTTP_201_CREATED, headers=headers)


def verifyEmailRedirect(request, key):
    """
    Redirects user to VMS UI for verification.
    """
    return redirect("/auth/verifyaccount/" + key)


class passwordResetConfirmRedirect(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return redirect("/auth/password/reset/confirm/");


def getUserTypes(request):
    """
    Get all possible user types.
    """
    return JsonResponse(dict(UserProfile.USER_AUTH_TYPES),
            safe=False)


class UserTypeUserList(generics.ListAPIView):
    serializer_class = UserSerializer

    def get(self, request, user_type):
        data = UserProfile.objects.filter(user_type=user_type)
        serializer = UserSerializer(data, many=True)
        return Response(serializer.data)


class UserTypesUserList(generics.ListAPIView):
    serializer_class = UserSerializer

    def get(self, request):
        args_dict = dict(request.GET.iterlists())
        user_types = []

        if 'user_types' in args_dict.keys():
            user_types = args_dict['user_types']

        data = UserProfile.objects.filter(user_type__in=user_types).order_by('user_type')
        serializer = UserSerializer(data, many=True)

        return Response(serializer.data)


class GuildMembersList(generics.ListAPIView):
    serializer_class = UserSerializer

    def get(self, request, guild_pk):
        data = UserProfile.objects.filter(guild=guild_pk)
        serializer = UserSerializer(data, many=True)
        return Response(serializer.data)


class UserManagementAdmin(APIView):
    serializer_class = UserSerializer
    permission_classes = (AdminOrReadOnlyPermission,)

    def put(self, request, user_id):
        try:
            userprofile = UserProfile.objects.get(id=user_id)
            user = userprofile.user
            if 'first_name' in request.data.keys():
                user.first_name = request.data['first_name']
            if 'last_name' in request.data.keys():
                user.last_name = request.data['last_name']
            if 'mobile' in request.data.keys():
                userprofile.mobile = request.data['mobile']
            if 'points' in request.data.keys():
                userprofile.points = request.data['points']
            if 'user_type' in request.data.keys():
                userprofile.user_type = request.data['user_type']
            user.save()
            userprofile.save()
            return Response(data=UserSerializer(userprofile).data,
                    status=status.HTTP_202_ACCEPTED)
        except UserProfile.DoesNotExist:
            return Response(data={'Error':'User not found.'},
                    status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, user_id):
        try:
            userprofile = UserProfile.objects.get(id=user_id)
            user = userprofile.user
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except UserProfile.DoesNotExist:
            return Response(data={'Error':'User not found.'},
                    status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AlternateNumbersList(APIView):
    serializer_class = UserSerializer
    permission_classes = (AnyUserReadWritePermission,)

    def put(self, request, user_id):
        try:
            beneficiary = UserProfile.objects.get(user__id=user_id)
            if 'alt_mobile' in request.data.keys():
                new_mobile = request.data['alt_mobile']

                if isinstance(new_mobile, list) and not isinstance(new_mobile,
                        (str, unicode)):
                    for n_mob in new_mobile:
                        if not any(n_mob == mobile for mobile in
                                beneficiary.alt_mobile):
                            beneficiary.alt_mobile.append(n_mob)
                else:
                    if not any(new_mobile == mobile for mobile in beneficiary.alt_mobile):
                        beneficiary.alt_mobile.append(new_mobile)

                beneficiary.save()

            return Response(data=UserSerializer(beneficiary).data,
                    status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response(data={'Error':'User not found.'},
                    status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
