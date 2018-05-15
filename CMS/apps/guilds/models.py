from django.contrib.auth.models import User
from django.db import models

from core.models import TimeStampedModel


class Guild(TimeStampedModel):
    name = models.CharField(max_length=40, unique=True)
    description = models.TextField()

    def __unicode__(self):
        return self.name
