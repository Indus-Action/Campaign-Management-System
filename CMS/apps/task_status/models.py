from django.db import models

from core.models import TimeStampedModel

from task_status_categories.models import TaskStatusCategory


class TaskStatus(TimeStampedModel):
    status = models.CharField(max_length=20, unique=True)
    desc = models.TextField(blank=True)
    category = models.ForeignKey(TaskStatusCategory, related_name='task_status', null=True)

    def __unicode__(self):
        return self.status
