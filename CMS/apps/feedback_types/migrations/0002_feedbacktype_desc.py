# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-08-18 10:58
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feedback_types', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedbacktype',
            name='desc',
            field=models.TextField(blank=True),
        ),
    ]
