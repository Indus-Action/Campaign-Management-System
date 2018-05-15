from rest_framework import viewsets

from spaces.models import Space
from spaces.serializers import SpaceSerializer


class SpaceViewSet(viewsets.ModelViewSet):
    queryset = Space.objects.all()
    serializer_class = SpaceSerializer
