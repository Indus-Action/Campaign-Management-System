from django.db import models

from core.models import TimeStampedModel
from django.contrib.auth.models import User


class IVRTemplate(TimeStampedModel):
    title = models.CharField(max_length=30, unique=True)
    exotel_app_id = models.TextField(unique=True)
    creator = models.ForeignKey(User, related_name="ivr_templates_created")

    def __unicode__(self):
        return self.exotel_app_id
