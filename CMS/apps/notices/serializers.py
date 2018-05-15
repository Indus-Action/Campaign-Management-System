from rest_framework import serializers

from notices.models import Notice


class NoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notice

        fields = ('id', 'creator', 'notice', 'created_at', 'updated_at',)
        read_only_fields = ('id', 'created_at', 'updated_at',)
