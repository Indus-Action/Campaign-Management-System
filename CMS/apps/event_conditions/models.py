from django.contrib.postgres.fields import JSONField

from django.db import models
from core.models import TimeStampedModel

from task_status.models import TaskStatus
from task_types.models import TaskType
from stages.models import Stage
from tags.models import Tag
from forms.models import Form


class EventCondition(TimeStampedModel):
    EVENT_CONDITION_TYPES = (
        ('USER', 'User'),
        ('TASK', 'Task'),
    )

    EVENT_CONDITION_CATEGORIES = (
        ('MC', 'Missed Call Condition'),
        ('NR', 'Normal Condition'),
    )

    name = models.CharField(max_length=20, unique=True)

    event_condition_type = models.CharField(
        max_length=4,
        choices=EVENT_CONDITION_TYPES,
        default='USER'
    )
    event_condition_category = models.CharField(
        max_length=2,
        choices=EVENT_CONDITION_CATEGORIES,
        default='NR'
    )
    task_type = models.ForeignKey(TaskType, null=True)
    stage = models.ForeignKey(Stage, null=True)
    event_tags = models.ManyToManyField(Tag, blank=True)
    task_status = models.ForeignKey(TaskStatus, null=True)
    hook = models.ForeignKey('hooks.Hook', null=True)
    params = JSONField(default={})

    def __unicode__(self):
        return str(self.task_type) + ' | ' + str(self.stage) + ' | ' + str(self.event_tags)
