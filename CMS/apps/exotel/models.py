from django.db import models

from task_types.models import TaskType
from task_status.models import TaskStatus
from stages.models import Stage
from event_conditions.models import EventCondition

from core.models import TimeStampedModel


class Exotel(TimeStampedModel):
    default_task_type = models.ForeignKey(TaskType, null=True)
    default_task_status = models.ForeignKey(TaskStatus, null=True)
    default_stage = models.ForeignKey(Stage, null=True)
    auto_assign = models.BooleanField(default=False)

    default_event_conditions = models.ManyToManyField(EventCondition, blank=True, related_name='exotel')
