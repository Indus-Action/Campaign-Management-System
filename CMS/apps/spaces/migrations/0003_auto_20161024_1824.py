# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-10-24 18:24
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('spaces', '0002_auto_20161024_1824'),
    ]

    operations = [
        migrations.AlterField(
            model_name='space',
            name='space_type',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='spaces', to='space_types.SpaceType'),
        ),
    ]
