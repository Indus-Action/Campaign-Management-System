from rest_auth.registration.serializers import RegisterSerializer

from user_profiles.models import UserProfile


class UserRegisterSerializer(RegisterSerializer):

    def custom_signup(self, request, user):
        user_profile = UserProfile.objects.create(user=user, user_type='VL')  # noqa
