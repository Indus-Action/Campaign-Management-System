from rest_framework import serializers

from ivrs.models import IVR

class IVRSerializer(serializers.ModelSerializer):
    class Meta:
        model = IVR

        fields = ('id', 'name', 'exotel_app_id', 'template', 'sender', 'beneficiary', 'created_at', 'updated_at',)

        read_only_fields = ('id', 'created_at', 'updated_at',)
