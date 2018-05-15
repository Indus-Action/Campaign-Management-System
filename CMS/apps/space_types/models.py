from django.db import models

from core.models import TimeStampedModel


class SpaceType(TimeStampedModel):
    name = models.CharField(max_length=20, unique=True)
    desc = models.TextField()

    def __unicode__(self):
        return self.name
