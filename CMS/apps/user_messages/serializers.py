from rest_framework import serializers

from user_messages.models import Message


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message

        fields = ('id', 'message', 'sender', 'beneficiary', 'created_at', 'updated_at', 'template')
        read_only_fields = ('id', 'created_at', 'updated_at',)
