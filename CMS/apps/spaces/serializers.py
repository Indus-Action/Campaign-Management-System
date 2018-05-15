from rest_framework import serializers

from spaces.models import Space


class SpaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Space

        fields = ('id', 'space_type', 'name', 'address', 'lat', 'lng', 'rating', 'created_at', 'updated_at',)
        read_only_fields = ('id', 'created_at', 'updated_at',)
