from centers.models import Center
from centers.serializers import CenterSerializer
from rest_framework import viewsets
# Create your views here.


class CenterViewSet(viewsets.ModelViewSet):
    queryset = Center.objects.all()
    serializer_class = CenterSerializer

