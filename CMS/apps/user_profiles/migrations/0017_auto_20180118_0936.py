# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2018-01-18 09:36
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user_profiles', '0016_auto_20171216_0416'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='owner',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]