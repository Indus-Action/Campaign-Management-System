# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('task_status', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('feedback_types', '0001_initial'),
        ('task_types', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('points', models.IntegerField(default=0)),
                ('start_date', models.DateField(default=datetime.datetime.today)),
                ('due_date', models.DateField(default=datetime.datetime.today)),
                ('estimation', models.IntegerField(default=2)),
                ('name', models.CharField(max_length=160)),
                ('description', models.TextField(help_text=b'Enter the task                                    description (optional)', blank=True)),
                ('assignee', models.ForeignKey(related_name='assigned_tasks', to=settings.AUTH_USER_MODEL)),
                ('beneficiary', models.ForeignKey(related_name='beneficiary_tasks', to=settings.AUTH_USER_MODEL, null=True)),
                ('creator', models.ForeignKey(related_name='created_tasks', to=settings.AUTH_USER_MODEL)),
                ('feedback_type', models.ForeignKey(related_name='tasks', to='feedback_types.FeedbackType')),
                ('status', models.ForeignKey(related_name='tasks', to='task_status.TaskStatus')),
                ('task_type', models.ForeignKey(related_name='tasks', to='task_types.TaskType')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
