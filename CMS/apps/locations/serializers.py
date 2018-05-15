from rest_framework import serializers

from locations.models import Location


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location

        fields = ('id', 'description', 'street_number', 'route', 'sublocality_level_3', 'sublocality_level_2',
                  'sublocality_level_1', 'locality', 'administrative_area_level_2',
                  'administrative_area_level_1', 'country', 'postal_code', 'lat', 'lng',
                  'created_at', 'updated_at',)

        read_only_fields = ('id', 'created_at', 'updated_at')
