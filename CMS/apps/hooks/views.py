from rest_framework import viewsets
from rest_framework.response import Response

from hooks.models import Hook
from hooks.serializers import HookSerializer


class HookViewSet(viewsets.ModelViewSet):
    queryset = Hook.objects.all()
    serializer_class = HookSerializer
