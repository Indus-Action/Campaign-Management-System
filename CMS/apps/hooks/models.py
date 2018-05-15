from django.apps import apps
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from core.models import TimeStampedModel

from django.contrib.auth.models import User
from django.dispatch import Signal


class Hook(TimeStampedModel):
    SEND_MESSAGE = 'SM'
    CREATE_TASK = 'CT'
    SEND_IVR = 'SI'
    ADD_TAG = 'AT'
    CHANGE_STAGE = 'CS'
    ARCHIVE_USER = 'AU'

    HOOK_TYPE_CHOICES = (
        (SEND_MESSAGE, 'Send Message'),
        (CREATE_TASK, 'Create Task'),
        (SEND_IVR, 'Send IVR'),
        (ADD_TAG, 'Add Tag'),
        (CHANGE_STAGE, 'Change Stage'),
        (ARCHIVE_USER, 'Archive User'),
    )

    action = models.ForeignKey('actions.Action', null=True, related_name='hooks')
    hook_type = models.CharField(max_length=2,
                                 choices=HOOK_TYPE_CHOICES,
                                 default=SEND_MESSAGE)

@receiver(post_save, sender=Hook, dispatch_uid="first_save_hook")
def hook_post_save_method(instance, sender, **kwargs):
    has_action = False

    has_action = (instance.action is not None)
    Action = apps.get_model('actions.Action')

    if not has_action:
        instance.action, created = Action.objects.get_or_create(name=instance.hook_type)

        instance.save()

post_save.connect(hook_post_save_method, sender=Hook, dispatch_uid="first_save_hook")
