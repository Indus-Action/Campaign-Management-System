# -*- coding: utf-8 -*-

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandError
from django.db.models import Q

from stages.models import Stage
from tasks.models import Task
from task_status.models import TaskStatus
from task_types.models import TaskType
from forms.models import FormData
from guilds.models import Guild

import csv
import pdb

class Command(BaseCommand):
    help = 'Does some magical work'

    def handle(self, *args, **options):
        with open('/home/ubuntu/eligible_documentation_28.csv') as f:
            rows = csv.reader(f)
            for row in rows:
                task = Task.objects.filter(Q(beneficiary__username=row[0][1:]))
                print task
                task.delete()
