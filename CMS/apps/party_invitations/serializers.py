from rest_framework import serializers

from party_invitations.models import PartyInvitation


class PartyInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartyInvitation

        fields = ('id', 'task', 'sender', 'invitee', 'accepted', 'seen', 'created_at', 'updated_at',)
        read_only_fields = ('id', 'created_at', 'updated_at',)
