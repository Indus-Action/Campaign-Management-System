from worker.models import Worker
from worker.serializers import WorkerSerializer
from rest_framework import viewsets
# Create your views here.


class WorkerViewSet(viewsets.ModelViewSet):
    queryset = Worker.objects.all()
    serializer_class = WorkerSerializer

