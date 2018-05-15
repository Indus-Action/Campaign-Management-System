from django.db import models

from core.models import TimeStampedModel


class Location(TimeStampedModel):
    description = models.CharField(max_length=200, default='', blank=True)
    street_number = models.CharField(max_length=10, default='', blank=True)
    route = models.CharField(max_length=40, default='', blank=True)
    sublocality_level_3 = models.CharField(max_length=40, default='', blank=True)
    sublocality_level_2 = models.CharField(max_length=40, default='', blank=True)
    sublocality_level_1 = models.CharField(max_length=40, default='', blank=True)
    locality = models.CharField(max_length=40, default='', blank=True)
    administrative_area_level_2 = models.CharField(max_length=40, default='', blank=True)
    administrative_area_level_1 = models.CharField(max_length=40, default='', blank=True)
    country = models.CharField(max_length=20, default='', blank=True)
    postal_code = models.CharField(max_length=10, default='', blank=True)
    lat = models.FloatField(default=0)
    lng = models.FloatField(default=0)

    def __unicode__(self):
        return "lat = " + str(self.lat) + ", long = " + str(self.lng)
