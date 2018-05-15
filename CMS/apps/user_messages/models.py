from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from core.models import TimeStampedModel

from django.contrib.auth.models import User
from message_templates.models import MessageTemplate

from vms2.settings.base import get_env_variable

import requests


class Message(TimeStampedModel):
    message = models.TextField()
    sender = models.ForeignKey(User, related_name='messages_sent', null=True)
    beneficiary = models.ForeignKey(User, related_name='messages_received')

    template = models.ForeignKey(MessageTemplate, related_name='messages', null=True)

    def __unicode__(self):
        return self.message

@receiver(post_save, sender=Message, dispatch_uid="first_save_message")
def message_post_save_method(instance, sender, **kwargs):
    has_template = (instance.template is not None)

    if has_template:
        if not instance.message:
            instance.message = instance.template.body
            instance.save()

        sid = get_env_variable('EXOTEL_SID')
        token = get_env_variable('EXOTEL_TOKEN')

        requests.post('http://twilix.exotel.in/v1/Accounts/{sid}/Sms/send.json'.format(sid=sid),
                      auth=(sid, token),
                      data={
                          'From': get_env_variable('EXOTEL_EXOPHONE'),
                          'To': instance.beneficiary.profile.mobile,
                          'Body': instance.message
                      })


post_save.connect(message_post_save_method, sender=Message, dispatch_uid="first_save_message")
