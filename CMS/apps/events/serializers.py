from rest_framework import serializers

from events.models import Event


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event

        fields = ('id', 'event_condition', 'creator', 'task', 'user', 'name', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
