from django.db import models

from core.models import TimeStampedModel

from locations.models import Location


class Organisation(TimeStampedModel):
    name = models.CharField(max_length=30)
    phone = models.CharField(max_length=20, blank=True)
    location = models.ForeignKey(Location, null=True)

    def __unicode__(self):
        return self.name
