from django.db import models

from core.models import TimeStampedModel

from django.contrib.auth.models import User


class Note(TimeStampedModel):
    note = models.TextField()
    creator = models.ForeignKey(User, related_name='created_notes')
    beneficiary = models.ForeignKey(User, related_name='beneficiary_notes')

    def __unicode__(self):
        return self.note
