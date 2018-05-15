from rest_framework import viewsets

from message_templates.models import MessageTemplate
from message_templates.serializers import MessageTemplateSerializer


class MessageTemplateViewSet(viewsets.ModelViewSet):
    queryset = MessageTemplate.objects.order_by('-created_at')
    serializer_class = MessageTemplateSerializer

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
