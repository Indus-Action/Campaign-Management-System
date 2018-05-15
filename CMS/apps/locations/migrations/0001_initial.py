# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('street_number', models.IntegerField(default=0)),
                ('route', models.CharField(default=b'', max_length=40)),
                ('sublocality_level_3', models.CharField(default=b'', max_length=20)),
                ('sublocality_level_2', models.CharField(default=b'', max_length=20)),
                ('sublocality_level_1', models.CharField(default=b'', max_length=20)),
                ('locality', models.CharField(default=b'', max_length=20)),
                ('administrative_area_level_2', models.CharField(default=b'', max_length=20)),
                ('administrative_area_level_1', models.CharField(default=b'', max_length=20)),
                ('country', models.CharField(default=b'', max_length=5)),
                ('pincode', models.CharField(default=b'', max_length=6)),
                ('lat', models.FloatField(default=0)),
                ('lng', models.FloatField(default=0)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
