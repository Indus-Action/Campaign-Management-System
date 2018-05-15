from rest_framework import serializers

from pledges.models import Pledge


class PledgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pledge

        fields = ('id', 'task', 'user', 'active', 'created_at', 'updated_at',)
        read_only_fields = ('id', 'created_at', 'updated_at',)
