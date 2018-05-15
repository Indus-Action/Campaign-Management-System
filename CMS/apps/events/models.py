from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from core.models import TimeStampedModel

from django.contrib.auth.models import User

from event_conditions.models import EventCondition
from hooks.models import Hook


class Event(TimeStampedModel):
    name = models.CharField(max_length=20)

    event_condition = models.ForeignKey(EventCondition, null=True)
    task = models.ForeignKey('tasks.Task', null=True, related_name='events')
    user = models.ForeignKey(User, null=True, related_name='events')
    creator = models.ForeignKey(User, null=True, related_name='created_events')

    def __unicode__(self):
        return str(self.task) + ' | ' + str(self.user) + ' | ' + str(self.hook)


@receiver(post_save, sender=Event)
def post_save_method(instance, **kwargs):
    if instance.event_condition and instance.event_condition.hook is not None:
        instance.event_condition.hook.action.fire(user=instance.user,
                                                  task=instance.task,
                                                  params=instance.event_condition.params)

post_save.connect(post_save_method, sender=Event)
