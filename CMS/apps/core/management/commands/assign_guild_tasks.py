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
from tags.models import Tag
from task_status_categories.models import TaskStatusCategory

import csv
import pdb
from datetime import datetime

class Command(BaseCommand):
    help = 'Does some magical work'

    def handle(self, *args, **options):
        guilds = Guild.objects.all()

        s_guilds = []

        # guilds = []

        exported_data = []
        users = []
        t = Tag.objects.get(tag="Lottery Round 1")
        ss = ['Documentation', 'Identification', 'Application', 'Applied']

        for g in guilds:
            ups = g.users.all()
            for up in ups:
                if not up.user:
                    u, created = User.objects.get_or_create(username=up.mobile)
                    up.user = u
                    up.save()

                users.append(up.user)

        print len(users)
        tt = TaskType.objects.get(pk=2)

        tags = Tag.objects.filter(pk__in=[17, 20])
        ts = TaskStatus.objects.last()
        cd = TaskStatus.objects.get(status='Call Done')
        cs = TaskStatus.objects.get(status='Call Success')
        tc = TaskStatusCategory.objects.get(pk=2)
        dec_23 = datetime(2016, 12, 23).date()
        doc = Stage.objects.get(name="Documentation")
        app = Stage.objects.get(name="Application")
        dd = datetime(2017, 1, 13)
        cnd = TaskStatus.objects.get(status="Call Not Done")

        tasks = list(Task.objects.filter(Q(beneficiary__profile__stage__name__in=ss) & ~Q(status=cnd) & Q(updated_at__gt=dd)))

        d_tasks = []

        numbers = []

        max = len(tasks) / len(users)
        print max
        print len(tasks)
        print ts

        for user in users:
            count = 0
            print user
            
            while count < max:
                if tasks:
                    task = tasks.pop()

                    try:
                        new_record = {}
                        new_record['number'] = task.beneficiary.profile.mobile
                        new_record['assignee'] = user.profile.mobile
                        new_record['guild'] = user.profile.guild
                        new_record['first_name'] = user.first_name
                        new_record['last_name'] = user.last_name
                        task.assignee = user
                        task.status = ts
                        task.save()
                        exported_data.append(new_record)
                        count += 1
                        print count
                    except:
                        pass

        if len(exported_data) > 0:
            keys = exported_data[0].keys()

            with open('guild_23Jan.csv', 'wb') as f:
                dict_writer = csv.DictWriter(f, keys)
                dict_writer.writeheader()
                dict_writer.writerows(exported_data)
