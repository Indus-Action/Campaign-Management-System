from rest_framework import serializers

from message_templates.models import MessageTemplate

class MessageTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageTemplate

        fields = ('id', 'title', 'body', 'creator', 'created_at', 'updated_at',)

        read_only_fields = ('id', 'created_at', 'updated_at',)
