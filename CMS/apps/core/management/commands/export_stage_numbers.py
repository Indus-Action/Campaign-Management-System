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
        
        stage = Stage.objects.get(pk=3)
        users = stage.users.all()

        users = UserProfile.objects.all()

        users = []

        tt = TaskType.objects.get(pk=4)

        tasks = tt.tasks.all()

        print len(tasks)

        for task in tasks:
            users.append(task.beneficiary.profile)

        for user in users:
            exported_data.append({"mobile": user.mobile})

        if len(exported_data) > 0:
            keys = exported_data[0].keys()

            with open('doc_15.csv', 'wb') as f:
                dict_writer = csv.DictWriter(f, keys)
                dict_writer.writeheader()
                dict_writer.writerows(exported_data)
