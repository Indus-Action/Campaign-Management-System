from __future__ import unicode_literals

from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField
from django.db import models

from core.models import TimeStampedModel


class Form(TimeStampedModel):
    name = models.CharField(max_length=20, unique=True)
    description = models.CharField(max_length=100, default='Description')
    schema = JSONField(default=[])

    def __unicode__(self):
        return self.name


class PersistentForm(Form):
    persistent = models.BooleanField(default=True)


class FormData(TimeStampedModel):
    form = models.ForeignKey(Form, related_name='data', on_delete=models.CASCADE)
    data = JSONField(default={})
    beneficiary_form = models.ForeignKey(User, related_name='form_beneficiary',null=True)


class PersistentFormData(FormData):
    persistent = models.BooleanField(default=True)
    beneficiary = models.OneToOneField(User, related_name='persistent_data')
