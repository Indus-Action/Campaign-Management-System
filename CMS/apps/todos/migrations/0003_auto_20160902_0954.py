# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-09-02 09:54
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('todos', '0002_auto_20160829_1053'),
    ]

    operations = [
        migrations.AddField(
            model_name='todo',
            name='beneficiary',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='beneficiary_todos', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='todo',
            name='assignee',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='todos_assigned', to=settings.AUTH_USER_MODEL),
        ),
    ]
