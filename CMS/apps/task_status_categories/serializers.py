from rest_framework import serializers

from task_status_categories.models import TaskStatusCategory

class TaskStatusCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskStatusCategory

        fields = ('id', 'category', 'creator', 'desc', 'task_completed_flag', 'created_at', 'updated_at',)
        read_only_fields = ('id', 'created_at', 'updated_at',)
