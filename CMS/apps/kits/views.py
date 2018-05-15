from kits.models import IAKit
from kits.serializers import KitSerializer
from rest_framework import viewsets
# Create your views here.


class KitViewSet(viewsets.ModelViewSet):
    queryset = IAKit.objects.all()
    serializer_class = KitSerializer

