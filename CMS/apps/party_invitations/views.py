from rest_framework import viewsets, generics
from rest_framework.response import Response

from party_invitations.models import PartyInvitation
from party_invitations.serializers import PartyInvitationSerializer


class PartyInvitationViewSet(viewsets.ModelViewSet):
    queryset = PartyInvitation.objects.order_by('created_at')
    serializer_class = PartyInvitationSerializer


class SentPartyInvitationsView(generics.ListAPIView):
    serializer_class = PartyInvitationSerializer

    def get(self, request, sender_pk=None):
        queryset = PartyInvitation.objects.filter(sender__id=sender_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


class ReceivedPartyInvitationsView(generics.ListAPIView):
    serializer_class = PartyInvitationSerializer

    def get(self, request, invitee_pk=None):
        queryset = PartyInvitation.objects.filter(invitee__id=invitee_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)
