from django.contrib.auth.models import User
from django.db import models

from core.models import TimeStampedModel


class Tag(TimeStampedModel):
    tag = models.CharField(max_length=30)
    desc = models.TextField(blank=True)

    users = models.ManyToManyField(User, blank=True, related_name='tags')
    mutually_exclusive_tags = models.ManyToManyField('self', blank=True, related_name='mutually_exclusive_tags')

    def __unicode__(self):
        return self.tag
