# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-09-14 07:22
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_profiles', '0005_merge'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='mobile',
            field=models.CharField(default=b'', max_length=11, unique=True),
        ),
    ]
