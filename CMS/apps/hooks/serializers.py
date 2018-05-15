from rest_framework import serializers

from hooks.models import Hook


class HookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hook

        fields = ('id', 'action', 'hook_type', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
