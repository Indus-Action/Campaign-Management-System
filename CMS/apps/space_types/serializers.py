from rest_framework import serializers

from space_types.models import SpaceType


class SpaceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpaceType

        fields = ('id', 'name', 'desc', 'created_at', 'updated_at',)
        read_only_fields = ('id', 'created_at', 'updated_at',)
