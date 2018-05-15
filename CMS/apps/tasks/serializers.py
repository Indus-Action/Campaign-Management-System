from rest_framework import serializers

from tasks.models import Task
from task_types.serializers import TaskTypeSerializer
from task_status.serializers import TaskStatusSerializer
from user_profiles.serializers import CustomUserDetailsSerializer
from interests.serializers import InterestSerializer
from locations.serializers import LocationSerializer
from pledges.serializers import PledgeSerializer
from task_comments.serializers import TaskCommentSerializer


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task

        fields = ('id', 'assignee', 'creator', 'beneficiary',
                  'start_date', 'due_date', 'status', 'task_type', 'pledges',
                  'created_at', 'updated_at', 'form_data', 'location', 'party',
                  'beneficiary_rating', 'assignee_rating', 'name', 'task_interests','mobile',)

        read_only_fields = ('id', 'created_at', 'updated_at',)


class TaskListTaskSerializer(serializers.ModelSerializer):
    assignee = CustomUserDetailsSerializer(required=False)
    beneficiary = CustomUserDetailsSerializer(required=False)
    task_type = TaskTypeSerializer(required=False)
    status = TaskStatusSerializer(required=False)
    task_interests = InterestSerializer(required=False, many=True)
    party = CustomUserDetailsSerializer(required=False, many=True)
    location = LocationSerializer(required=False)
    pledges = PledgeSerializer(required=False, many=True)
    comments = TaskCommentSerializer(required=False, many=True)

    class Meta:
        model = Task

        fields = ('id', 'assignee', 'creator', 'beneficiary',
                  'start_date', 'due_date', 'status', 'task_type', 'pledges', 'comments',
                  'created_at', 'updated_at', 'form_data', 'task_interests', 'party',
                  'beneficiary_rating', 'assignee_rating', 'name', 'location','mobile',)

        read_only_fields = ('id', 'created_at', 'updated_at',)
