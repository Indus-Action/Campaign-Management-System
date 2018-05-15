from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from tasks.models import Task

from core.models import TimeStampedModel


class PartyInvitation(TimeStampedModel):
    class Meta:
        unique_together = ['task', 'invitee']

    task = models.ForeignKey(Task, related_name='invitations')
    sender = models.ForeignKey(User, related_name='sent_invitations')
    invitee = models.ForeignKey(User, related_name='received_invitations')
    accepted = models.BooleanField(default=False)
    seen = models.BooleanField(default=False)

    def __unicode__(self):
        return str(self.task) + '<-->' + str(self.invitee) + '<-->' + str(self.accepted)


@receiver(post_save, sender=PartyInvitation)
def party_invitation_post_save_method(instance, **kwargs):
    if instance.accepted:
        task = instance.task
        invitee = instance.invitee

        task.party.add(invitee)


post_save.connect(party_invitation_post_save_method, sender=PartyInvitation)
