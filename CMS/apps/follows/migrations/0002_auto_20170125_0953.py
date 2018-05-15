# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2017-01-25 09:53
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('follows', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='follow',
            name='accepted_status',
        ),
        migrations.AddField(
            model_name='follow',
            name='active',
            field=models.BooleanField(default=True),
        ),
    ]
