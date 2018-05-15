# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-07-28 09:46
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('locations', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Organisation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=30)),
                ('phone', models.CharField(blank=True, max_length=20)),
                ('location', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='locations.Location')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
