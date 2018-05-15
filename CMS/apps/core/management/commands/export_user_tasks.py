# -*- coding: utf-8 -*-

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandError

from stages.models import Stage
from tasks.models import Task
from task_status.models import TaskStatus
from task_types.models import TaskType
from forms.models import FormData
from guilds.models import Guild
from tags.models import Tag

import csv
import pdb

class Command(BaseCommand):
    help = 'Does some magical work'

    def handle(self, *args, **options):
        ts = Task.objects.filter(assignee__pk__in=[169857])
        
        exported_data = []

        for t in ts:
            new_record = {}
            new_record['number'] = t.beneficiary.username
            new_record['assignee'] = t.assignee.username
            new_record['guild'] = t.assignee.profile.guild.name
            new_record['first_name'] = t.assignee.first_name
            new_record['last_name'] = t.assignee.last_name
            exported_data.append(new_record)

        if len(exported_data) > 0:
            keys = exported_data[0].keys()

            with open('ss_30_nov_user_rem.csv', 'wb') as f:
                dict_writer = csv.DictWriter(f, keys)
                dict_writer.writeheader()
                dict_writer.writerows(exported_data)

