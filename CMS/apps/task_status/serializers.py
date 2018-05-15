from rest_framework import serializers

from task_status.models import TaskStatus


class TaskStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskStatus

        fields = ('id', 'status', 'desc', 'category', 'created_at', 'updated_at')

        read_only_fields = ('id', 'created_at', 'updated_at')
