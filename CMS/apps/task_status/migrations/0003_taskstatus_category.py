# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-09-28 06:19
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('task_status_categories', '0001_initial'),
        ('task_status', '0002_taskstatus_desc'),
    ]

    operations = [
        migrations.AddField(
            model_name='taskstatus',
            name='category',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='task_status', to='task_status_categories.TaskStatusCategory', null=True),
            preserve_default=False,
        ),
    ]
