# -*- coding: utf-8 -*-

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandError

from stages.models import Stage
from tasks.models import Task
from task_status.models import TaskStatus
from task_types.models import TaskType
from forms.models import FormData
from guilds.models import Guild
from stages.models import Stage
from tags.models  import Tag
from user_profiles.models import UserProfile

import csv
import pdb

class Command(BaseCommand):
    help = 'Does some magical work'

    def handle(self, *args, **options):
        exported_data = []

        ups = UserProfile.objects.filter(stage=Stage.objects.get(name='Identification')).exclude(user__tags__in=[Tag.objects.get(tag='Data Entry CC 2')]).exclude(user__tags__in=[Tag.objects.get(tag='Sent to CC 2')])[:20000]
        # ups = UserProfile.objects.filter(user__tags__in=[Tag.objects.get(tag='Lottery Success')]).exclude(user__tags__in=[Tag.objects.get(tag='Admitted 2017')])

        count = 0
        for up in ups:
            count += 1
            print count
            Tag.objects.get(tag='Sent to CC 2').users.add(up.user)
            exported_data.append({'mobile':up.mobile})

        keys = exported_data[0].keys()

        with open('ID_numbers.csv', 'wb') as f:
            dict_writer = csv.DictWriter(f, keys)
            dict_writer.writeheader()
            dict_writer.writerows(exported_data)

