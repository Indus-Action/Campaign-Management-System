from django.db import models

from core.models import TimeStampedModel
from space_types.models import SpaceType


class Space(TimeStampedModel):
    space_type = models.ManyToManyField(SpaceType, related_name='spaces', blank=True)

    name = models.TextField(default='')
    address = models.TextField(default='')
    lat = models.FloatField(default=0)
    lng = models.FloatField(default=0)

    rating = models.IntegerField(default=0)

    def __unicode__(self):
        return self.address
