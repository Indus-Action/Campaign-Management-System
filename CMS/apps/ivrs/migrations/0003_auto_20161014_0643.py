# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-10-14 06:43
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ivrs', '0002_auto_20161012_1327'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ivr',
            name='name',
            field=models.CharField(default=b'hooked_ivr', max_length=30),
        ),
    ]
