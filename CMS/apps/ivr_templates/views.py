from rest_framework import viewsets

from ivr_templates.models import IVRTemplate
from ivr_templates.serializers import IVRTemplateSerializer


class IVRTemplateViewSet(viewsets.ModelViewSet):
    queryset = IVRTemplate.objects.order_by('-created_at')
    serializer_class = IVRTemplateSerializer

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
