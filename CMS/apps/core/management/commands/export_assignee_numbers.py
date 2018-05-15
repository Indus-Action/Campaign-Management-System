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
from user_profiles.models import UserProfile

import csv
import pdb

class Command(BaseCommand):
    help = 'Does some magical work'

    def handle(self, *args, **options):
        exported_data = []

        tasks = Task.objects.all()
        ass = {}
        for task in tasks:
            if task.assignee not in ass.keys():
                ass[task.assignee] = {}
                if task.assignee:
                    ass[task.assignee]["mobile"] = task.assignee.profile.mobile
                    ass[task.assignee]["number"] = 0
                    if hasattr(task.assignee, 'guild'):
                        ass[task.assignee]["guild"] = task.assignee.guild
                    else:
                        ass[task.assignee]["guild"] = None
                    ass[task.assignee]["first_name"] = task.assignee.first_name
                    ass[task.assignee]["last_name"] = task.assignee.last_name                
                else:
                    ass[task.assignee]["mobile"] = None
                    ass[task.assignee]["number"] = 0
                    ass[task.assignee]["guild"] = None
                    ass[task.assignee]["first_name"] = None
                    ass[task.assignee]["last_name"] = None

            ass[task.assignee]["number"] += 1

        for x in ass:
            exported_data.append(ass[x])

        keys = exported_data[0].keys()

        with open('data_4Jan.csv', 'wb') as f:
            dict_writer = csv.DictWriter(f, keys)
            dict_writer.writeheader()
            dict_writer.writerows(exported_data)

        
            
