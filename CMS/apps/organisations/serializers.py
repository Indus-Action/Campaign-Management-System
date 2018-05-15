from rest_framework import serializers

from organisations.models import Organisation


class OrganisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organisation

        fields = ('id', 'name', 'phone', 'created_at', 'updated_at')

        read_only_fields = ('id', 'created_at', 'updated_at')
