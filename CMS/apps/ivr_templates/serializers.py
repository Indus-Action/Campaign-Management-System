from rest_framework import serializers

from ivr_templates.models import IVRTemplate

class IVRTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = IVRTemplate

        fields = ('id', 'title', 'exotel_app_id', 'creator', 'created_at', 'updated_at',)

        read_only_fields = ('id', 'created_at', 'updated_at',)
