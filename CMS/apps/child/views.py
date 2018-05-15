from child.models import Child
from child.serializers import ChildSerializer
from rest_framework import viewsets
# Create your views here.


class ChildViewSet(viewsets.ModelViewSet):
    queryset = Child.objects.all()
    serializer_class = ChildSerializer

