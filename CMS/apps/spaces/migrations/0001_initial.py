# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-10-24 18:19
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('space_types', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Space',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('address', models.TextField(default=b'')),
                ('lat', models.FloatField(default=0)),
                ('lng', models.FloatField(default=0)),
                ('space_type', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='spaces', to='space_types.SpaceType')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
