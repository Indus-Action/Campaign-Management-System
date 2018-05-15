from rest_framework import serializers

from feedback_types.models import FeedbackType


class FeedbackTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackType

        fields = ('id', 'feedback_type', 'desc', 'created_at', 'updated_at')

        read_only_fields = ('id', 'created_at', 'updated_at')
