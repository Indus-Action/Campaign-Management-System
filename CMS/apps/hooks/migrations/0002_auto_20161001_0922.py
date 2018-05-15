# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-10-01 09:22
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('hooks', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hook',
            name='action',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='hooks', to='actions.Action'),
        ),
    ]
