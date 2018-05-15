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
        g = Guild.objects.get(name="CC - 07")
        ups = g.users.all()
        users = []

        for up in ups:
            users.append(up.user)

        ts = Task.objects.filter(assignee__in=users)

        numbers = []

        with open('/home/ubuntu/vms2/ss_30_nov.csv') as f:
            rows = csv.reader(f)

            for row in rows:
                numbers.append(row[4])

        count = 0

        for t in ts:
            if t.beneficiary.username not in numbers:
                print t.beneficiary.username
                        
