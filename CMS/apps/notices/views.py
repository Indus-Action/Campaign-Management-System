from rest_framework import viewsets

from notices.models import Notice
from notices.serializers import NoticeSerializer


class NoticeViewSet(viewsets.ModelViewSet):
    queryset = Notice.objects.order_by('created_at')
    serializer_class = NoticeSerializer
