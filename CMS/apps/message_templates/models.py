from django.db import models

from django.contrib.auth.models import User
from core.models import TimeStampedModel


class MessageTemplate(TimeStampedModel):
    title = models.CharField(max_length=30, default="")
    body = models.TextField()
    creator = models.ForeignKey(User, related_name="message_templates_created")

    def __unicode__(self):
        return self.body
