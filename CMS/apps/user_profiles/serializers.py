from django.contrib.auth import get_user_model

from rest_framework import serializers

from user_profiles.models import UserProfile
from stages.serializers import StageSerializer
from guilds.serializers import GuildSerializer


# Get the UserModel
UserModel = get_user_model()

class CustomUserDetailsSerializer(serializers.ModelSerializer):

    """
    UserDetailsSerializer with extra 'id' field.
    """
    points = serializers.IntegerField(source='profile.points')
    mobile = serializers.CharField(source='profile.mobile')

    class Meta:
        model=UserModel
        fields = ('id', 'email', 'first_name', 'last_name', 'profile', 'username', 'points', 'mobile',)
        read_only_fields = ('id', 'email',)


class UserSerializer(serializers.ModelSerializer):

    user = CustomUserDetailsSerializer(read_only=True)
    owner= CustomUserDetailsSerializer(read_only=False)
    stage = StageSerializer(read_only=True)
    guild = GuildSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ('id', 'user', 'mobile', 'alt_mobile', 'points', 'user_type',
                'stage', 'archived', 'number_of_missed_calls', 'guild',
                'training_kits_seen','owner')
