# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-11-25 07:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_profiles', '0012_userprofile_alt_mobile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='mobile',
            field=models.CharField(default=b'', max_length=20, unique=True),
        ),
    ]
