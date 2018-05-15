# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-10-31 09:43
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('forms', '0004_auto_20161027_1058'),
    ]

    operations = [
        migrations.CreateModel(
            name='PersistentFormData',
            fields=[
                ('formdata_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='forms.FormData')),
                ('persistent', models.BooleanField(default=True)),
                ('beneficiary', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='persistent_data', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
            bases=('forms.formdata',),
        ),
    ]
