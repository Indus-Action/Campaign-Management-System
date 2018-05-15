from django.http import JsonResponse

from rest_framework import viewsets, generics
from rest_framework.response import Response

from event_conditions.serializers import EventConditionSerializer
from event_conditions.models import EventCondition


class EventConditionViewSet(viewsets.ModelViewSet):
    queryset = EventCondition.objects.order_by('created_at')
    serializer_class = EventConditionSerializer


class HelplineEventConditionsView(generics.ListAPIView):
    serializer_class = EventConditionSerializer

    def get(self, request):
        queryset = EventCondition.objects.filter(event_condition_category='MC')
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


class NormalEventConditionsView(generics.ListAPIView):
    serializer_class = EventConditionSerializer

    def get(self, request):
        queryset = EventCondition.objects.filter(event_condition_category='NR')
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


def getEventConditionTypes(request):
    return JsonResponse(dict(EventCondition.EVENT_CONDITION_TYPES),
                        safe=False)
