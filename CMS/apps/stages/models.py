from django.contrib.auth.models import User
from django.db import models

from core.models import TimeStampedModel

from task_types.models import TaskType


class Stage(TimeStampedModel):
    name = models.CharField(max_length=30)
    desc = models.TextField(blank=True)

    task_type = models.ForeignKey(TaskType, related_name='stages')

    create_task_on_transition = models.BooleanField(default=False)

    def __unicode__(self):
        return self.name
