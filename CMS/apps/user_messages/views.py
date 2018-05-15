from rest_framework import viewsets, generics
from rest_framework.response import Response

from user_messages.models import Message
from user_messages.serializers import MessageSerializer


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.order_by('-created_at')
    serializer_class = MessageSerializer


class BeneficiaryMessagesView(generics.ListAPIView):
    serializer_class = MessageSerializer

    def get(self, request, user_pk=None):
        queryset = Message.objects.filter(beneficiary=user_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


class SentMessagesView(generics.ListAPIView):
    serializer_class = MessageSerializer

    def get(self, request, user_pk=None):
        queryset = Message.objects.filter(sender=user_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)
