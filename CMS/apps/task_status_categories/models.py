from django.contrib.auth.models import User
from django.db import models

from core.models import TimeStampedModel


class TaskStatusCategory(TimeStampedModel):
    TASK_COMPLETED_FLAG_CHOICES = (
        ('TODO', 'To Do'),
        ('PROG', 'In Progress'),
        ('DONE', 'Done'),
    )

    category = models.CharField(max_length=20, unique=True)
    desc = models.TextField()

    task_completed_flag = models.CharField(max_length=4,
                                           choices=TASK_COMPLETED_FLAG_CHOICES,
                                           default='TODO')

    creator = models.ForeignKey(User, related_name='created_task_categories', null=True)

    def __unicode__(self):
        return self.category
