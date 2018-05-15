from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from core.models import TimeStampedModel

from django.contrib.auth.models import User
from ivr_templates.models import IVRTemplate

from vms2.settings.base import get_env_variable

import requests


class IVR(TimeStampedModel):
    name = models.CharField(max_length=30, default='hooked_ivr')
    exotel_app_id = models.IntegerField()
    sender = models.ForeignKey(User, related_name='ivrs_sent', null=True)
    beneficiary = models.ForeignKey(User, related_name='ivrs_received')
    template = models.ForeignKey(IVRTemplate, related_name='ivrs')

    def __unicode__(self):
        return self.exotel_app_id

@receiver(post_save, sender=IVR, dispatch_uid="first_save_ivr")
def ivr_post_save_method(instance, sender, **kwargs):
    has_template = (instance.template is not None)

    if has_template:
        if not instance.exotel_app_id:
            instance.exotel_app_id = instance.template.exotel_app_id
            instance.save()

        sid = get_env_variable('EXOTEL_SID')
        token = get_env_variable('EXOTEL_TOKEN')
        exophone = get_env_variable('EXOTEL_EXOPHONE')

        requests.post('https://twilix.exotel.in/v1/Accounts/{sid}/Calls/connect.json'.format(sid=sid),
                      auth=(sid, token),
                      data={
                          'From': instance.beneficiary.profile.mobile,
                          'To': exophone,
                          'CallerId': exophone,
                          'Url': 'http://my.exotel.in/exoml/start/' + str(instance.exotel_app_id),
                          'CallType': 'trans'
                      })


post_save.connect(ivr_post_save_method, sender=IVR, dispatch_uid="first_save_ivr")
