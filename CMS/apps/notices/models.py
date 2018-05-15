from django.contrib.auth.models import User
from django.db import models

from core.models import TimeStampedModel


class Notice(TimeStampedModel):
    notice = models.TextField()
    creator = models.ForeignKey(User, related_name='notices', null=True)
