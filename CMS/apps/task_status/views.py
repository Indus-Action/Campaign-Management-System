from rest_framework import viewsets

from task_status.serializers import TaskStatusSerializer
from task_status.models import TaskStatus


class TaskStatusViewSet(viewsets.ModelViewSet):
    queryset = TaskStatus.objects.order_by('created_at')
    serializer_class = TaskStatusSerializer
