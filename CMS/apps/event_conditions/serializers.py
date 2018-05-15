from rest_framework import serializers

from event_conditions.models import EventCondition

from stages.serializers import StageSerializer
from task_types.serializers import TaskTypeSerializer
from task_status.serializers import TaskStatusSerializer
from tags.serializers import TagSerializer


class EventConditionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventCondition

        fields = ('id', 'name', 'task_type', 'task_status', 'stage', 'event_condition_type',
                  'event_condition_category', 'hook', 'params', 'event_tags', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class DisplayedEventConditionSerializer(serializers.ModelSerializer):
    stage = StageSerializer(required=False)
    task_type = TaskTypeSerializer(required=False)
    task_status = TaskStatusSerializer(required=False)
    event_tags = TagSerializer(required=False, many=True)

    class Meta:
        model = EventCondition

        fields = ('id', 'name', 'task_type', 'task_status', 'stage', 'event_condition_type',
                  'event_condition_category', 'hook', 'params', 'event_tags', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
