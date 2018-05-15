from rest_framework import viewsets

from feedback_types.serializers import FeedbackTypeSerializer
from feedback_types.models import FeedbackType


class FeedbackTypeViewSet(viewsets.ModelViewSet):
    queryset = FeedbackType.objects.order_by('created_at')
    serializer_class = FeedbackTypeSerializer
