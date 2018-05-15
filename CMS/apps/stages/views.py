from rest_framework import viewsets

from stages.serializers import StageSerializer
from stages.models import Stage


class StageViewSet(viewsets.ModelViewSet):
    queryset = Stage.objects.order_by('created_at')
    serializer_class = StageSerializer
