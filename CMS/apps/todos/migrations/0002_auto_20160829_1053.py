# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-08-29 10:53
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todos', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todo',
            name='due_date',
            field=models.DateField(blank=True),
        ),
    ]
