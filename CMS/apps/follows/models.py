from django.contrib.auth.models import User
from django.db import models

from core.models import TimeStampedModel


class Follow(TimeStampedModel):
    class Meta:
        unique_together = ['follower', 'followed']

    follower = models.ForeignKey(User, related_name='sent_follows')
    followed = models.ForeignKey(User, related_name='received_follows')

    active = models.BooleanField(default=True)

    def __unicode__(self):
        return str(self.followed) + '<-' + str(self.follower)
