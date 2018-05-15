from django.contrib.auth.models import User
from django.db import models

from core.models import TimeStampedModel
from user_profiles.models import UserProfile


class Interest(TimeStampedModel):
    interest = models.CharField(max_length=30, unique=True)
    desc = models.TextField(default='Interest Description')

    users = models.ManyToManyField(User, blank=True, related_name='interests')
