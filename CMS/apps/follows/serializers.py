from rest_framework import serializers

from follows.models import Follow
from user_profiles.serializers import CustomUserDetailsSerializer


class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow

        fields = ('id', 'follower', 'followed', 'active', 'created_at', 'updated_at',)
        read_only_fields = ('id', 'created_at', 'updated_at')


class DetailedFollowSerializer(serializers.ModelSerializer):
    followed = CustomUserDetailsSerializer(read_only=True)

    class Meta:
        model = Follow

        fields = ('id', 'follower', 'followed', 'active', 'created_at', 'updated_at',)
        read_only_fields = ('id', 'created_at', 'updated_at')
