from django.contrib.auth.models import User
from django.db import models

from core.models import TimeStampedModel

from tasks.models import Task


class Pledge(TimeStampedModel):
    class Meta:
        unique_together = ['task', 'user']

    task = models.ForeignKey(Task, related_name='pledges')
    user = models.ForeignKey(User, related_name='pledges')
    active = models.BooleanField(default=True)

    def __unicode__(self):
        return str(self.task) + '<-' + str(self.user)
