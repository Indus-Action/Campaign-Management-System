from rest_framework import viewsets

from task_types.serializers import TaskTypeSerializer
from task_types.models import TaskType


class TaskTypeViewSet(viewsets.ModelViewSet):
    queryset = TaskType.objects.order_by('created_at')
    serializer_class = TaskTypeSerializer
