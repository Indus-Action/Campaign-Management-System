# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='assignee',
            field=models.ForeignKey(related_name='assigned_tasks', to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AlterField(
            model_name='task',
            name='creator',
            field=models.ForeignKey(related_name='created_tasks', to=settings.AUTH_USER_MODEL, null=True),
        ),
    ]
