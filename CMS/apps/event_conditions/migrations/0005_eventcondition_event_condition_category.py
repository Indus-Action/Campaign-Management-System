# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-10-14 07:07
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event_conditions', '0004_eventcondition_event_condition_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='eventcondition',
            name='event_condition_category',
            field=models.CharField(choices=[(b'MC', b'Missed Call Condition'), (b'NR', b'Normal Condition')], default=b'NR', max_length=2),
        ),
    ]
