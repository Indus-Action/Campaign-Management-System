from rest_framework import serializers

from task_types.models import TaskType


class TaskTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskType

        fields = ('id', 'task_type', 'desc', 'points', 'estimation', 'default_task_status',
                  'feedback_type', 'created_at', 'updated_at', 'training_kit', 'form', 'sla',)

        read_only_fields = ('id', 'created_at', 'updated_at')
