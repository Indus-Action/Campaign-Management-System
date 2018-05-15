from rest_framework import serializers

from task_comments.models import TaskComment
from user_profiles.serializers import CustomUserDetailsSerializer


class TaskCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskComment

        fields = ('id', 'comment', 'commentor', 'task', 'created_at', 'updated_at',)
        read_only_fields = ('id', 'created_at', 'updated_at',)


class TaskCommentDetailedSerializer(serializers.ModelSerializer):
    commentor = CustomUserDetailsSerializer(required=False)

    class Meta:
        model = TaskComment

        fields = ('id', 'comment', 'commentor', 'task', 'created_at', 'updated_at',)
        read_only_fields = ('id', 'created_at', 'updated_at',)
