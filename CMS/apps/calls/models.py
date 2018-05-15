from django.db import models
from core.models import TimeStampedModel

from django.contrib.auth.models import User

from tasks.models import Task


class Call(TimeStampedModel):
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(auto_now=True)

    beneficiary = models.ForeignKey(User, null=True, related_name='beneficiary_calls')
    caller = models.ForeignKey(User, null=True, related_name='caller_calls')

    task = models.ForeignKey(Task, null=True)

    end = models.BooleanField(default=False)
    mobile=models.CharField(max_length=30, blank=True,null=True)

    def __unicode__(self):
        return str(self.id)
