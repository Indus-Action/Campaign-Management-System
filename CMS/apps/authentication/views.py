from rest_framework import viewsets

from django.contrib.auth.models import User

from user_profiles.serializers import CustomUserDetailsSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = CustomUserDetailsSerializer
