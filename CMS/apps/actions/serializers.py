from rest_framework import serializers

from actions.models import Action


class ActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Action

        fields = ('id', 'name', 'desc', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
