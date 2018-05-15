from rest_framework import viewsets, generics
from rest_framework.response import Response

from events.models import Event
from events.serializers import EventSerializer


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


class EventConditionEventsView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get(self, request, event_pk=None):
        queryset = self.queryset.filter(event__pk=event_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


class TaskEventsView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get(self, request, task_pk=None):
        queryset = self.queryset.filter(task__pk=task_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


class UserEventsView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get(self, request, user_pk=None):
        queryset = self.queryset.filter(user__pk=user_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)
