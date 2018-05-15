from django.contrib.auth.models import User
from django.db import models
from django.db.models import Q
from django.db.models.signals import post_save
from django.dispatch import receiver

from datetime import datetime, timedelta

from feedback_types.models import FeedbackType
from task_types.models import TaskType
from task_status.models import TaskStatus
from core.models import TimeStampedModel
from forms.models import FormData
from event_conditions.models import EventCondition
from events.models import Event
from interests.models import Interest
from locations.models import Location


class Task(TimeStampedModel):
    name = models.CharField(max_length=30, blank=True)
    assignee = models.ForeignKey(User, related_name='assigned_tasks', null=True)
    creator = models.ForeignKey(User, related_name='created_tasks', null=True)
    beneficiary = models.ForeignKey(User,
                                    related_name='beneficiary_tasks',
                                    null=True)

    party = models.ManyToManyField(User, blank=True, related_name='group_tasks')

    due_date = models.DateField(default=datetime.today)
    start_date = models.DateField(default=datetime.today)

    beneficiary_rating = models.IntegerField(blank=True, default=0)
    assignee_rating = models.FloatField(blank=True, default=0)

    status = models.ForeignKey(TaskStatus, related_name='tasks')
    task_type = models.ForeignKey(TaskType, related_name='tasks')
    form_data = models.ForeignKey(FormData, null=True, related_name='tasks')
    task_interests = models.ManyToManyField(Interest, blank=True, related_name='tasks')
    location = models.ForeignKey(Location, null=True, related_name='tasks')
    mobile=models.CharField(max_length=30, blank=True,null=True)

@receiver(post_save, sender=Task)
def task_post_save_method(instance, **kwargs):
    task_type = instance.task_type
    status = instance.status

    conditions = EventCondition.objects.filter((Q(task_type__isnull=True) | Q(task_type=task_type)) &
                                               (Q(task_status__isnull=True) | Q(task_status=status)) &
                                               Q(event_condition_type='TASK'))

    for condition in conditions:
        Event.objects.create(name=condition.name, event_condition=condition, user=instance.beneficiary, task=instance)


@receiver(post_save, sender=Task, dispatch_uid="first_save_task")
def task_init_method(instance, sender, created, **kwargs):
    if not created:
        return

    form_data = None
    form_data_tasks = {}

    task_type = instance.task_type
    beneficiary = instance.beneficiary
    sla = task_type.sla

    task = instance
    tasks = {}

    if task_type.form:
        consistent = False

        tasks[task.beneficiary] = Task.objects.filter(Q(beneficiary=task.beneficiary) &
                                                      Q(task_type=task_type))

        for key in tasks:
            f_data_found = False
            f_data = None

            consistent = True
            for t in tasks[key]:
                if t.form_data:
                    f_data_found = True
                    f_data = t.form_data
                else:
                    consistent = False

            if not f_data_found:
                f_data = FormData.objects.create(form=task_type.form)

            if not consistent:
                tasks[key].update(form_data=f_data)


post_save.connect(task_post_save_method, sender=Task)
post_save.connect(task_init_method, sender=Task, dispatch_uid="first_save_task")
