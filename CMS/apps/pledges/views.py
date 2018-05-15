from rest_framework import viewsets, generics
from rest_framework.decorators import api_view
from rest_framework.response import Response

from pledges.models import Pledge

from pledges.serializers import PledgeSerializer


class PledgeViewSet(viewsets.ModelViewSet):
    queryset = Pledge.objects.order_by('created_at')
    serializer_class = PledgeSerializer


class TaskPledgesView(generics.ListAPIView):
    serializer_class = PledgeSerializer

    def get(self, request, task_pk=None):
        queryset = Pledge.objects.filter(task=task_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


class UserPledgesView(generics.ListAPIView):
    serializer_class = PledgeSerializer

    def get(self, request, user_pk=None):
        queryset = Pledge.objects.filter(user=user_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)
