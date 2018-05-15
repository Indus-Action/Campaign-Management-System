from django.db import models

from core.models import TimeStampedModel

from feedback_types.models import FeedbackType
from training_kits.models import TrainingKit
from forms.models import Form
from task_status.models import TaskStatus


class TaskType(TimeStampedModel):
    task_type = models.CharField(max_length=20,
                                 unique=True)
    desc = models.TextField(blank=True)

    points = models.IntegerField(default=0)
    estimation = models.IntegerField(default=2)
    sla = models.IntegerField(default=24)

    feedback_type = models.ForeignKey(FeedbackType,
                                      related_name='task_types',
                                      null=True)

    training_kit = models.ForeignKey(TrainingKit,
                                     related_name='task_types',
                                     null=True)
    default_task_status = models.ForeignKey(TaskStatus,
                                            related_name='task_types',
                                            null=True)

    form = models.ForeignKey(Form,
                             related_name='task_types',
                             null=True)

    def __unicode__(self):
        return self.task_type
