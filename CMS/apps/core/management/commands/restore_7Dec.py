# -*- coding: utf-8 -*-

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandError

from stages.models import Stage
from tasks.models import Task
from task_status.models import TaskStatus
from task_types.models import TaskType
from forms.models import FormData, PersistentFormData
from guilds.models import Guild
from tags.models import Tag

import csv
import pdb
from datetime import datetime
import json

class Command(BaseCommand):
    help = 'Does some magical work'

    def handle(self, *args, **options):
        st = datetime(2016, 12, 8, 3, 0, 0)

        pfds = PersistentFormData.objects.filter(updated_at__lt=st)

        data = {}

        with open('/home/ubuntu/restore_7.csv') as f:
            rows = csv.reader(f, quotechar="'")
            for row in rows:
                data[row[2]] = json.loads(row[1])

        for pfd in pfds:
            if str(pfd.id) in data.keys():
                if len(json.dumps(pfd.data)) < len(json.dumps(data[str(pfd.id)])):
                    pfd.data = data[str(pfd.id)]
                    pfd.save()
