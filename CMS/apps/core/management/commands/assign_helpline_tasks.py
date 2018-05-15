# -*- coding: utf-8 -*-

from django.core.management.base import BaseCommand, CommandError

from stages.models import Stage
from tasks.models import Task
from task_status.models import TaskStatus
from task_types.models import TaskType
from tags.models import Tag
from forms.models import FormData
from guilds.models import Guild
from user_profiles.models import UserProfile
from django.db.models import Q

import csv
from datetime import datetime, timedelta

class Command(BaseCommand):
    help = 'Does some magical work'

    def handle(self, *args, **options):
        profiles = UserProfile.objects.filter(user_type='HL')

        # big_4 = [216325, 192951, 100278, 193405]
        # big_4 = [192950, 192948]

        big_4 = []
        # profiles = []

        for profile in big_4:
            prof = UserProfile.objects.get(pk=profile)
            profiles.append(prof)

        tt = TaskType.objects.get(task_type='Retention Survey')
        ts = TaskStatus.objects.get(status='Call Not Done')
        # ts = TaskStatus.objects.get(status='CC Calling')
      #  lottery = Tag.objects.get(tag="Lottery Rejected")
        stage = Stage.objects.get(name="Identification")

        tasks = list(Task.objects.filter(Q(status=ts) & (~Q(assignee__profile__user_type='HL') | Q(assignee__isnull=True))).exclude(task_type__task_type='Retention Survey'))
        # tasks = list(Task.objects.filter(Q(status=TaskStatus.objects.get(status='Import Success')) & (~Q(assignee__profile__user_type='HL') | Q(assignee__isnull=True))))
    	# tasks = list(Task.objects.filter(task_type__task_type='Retention Survey'))
        # tasks = list(Task.objects.filter(Q(status=ts, task_type=tt, beneficiary__profile__stage=stage) & ~Q(assignee__profile__user_type='HL')))
        # tasks = list(Task.objects.filter(status=ts, assignee__isnull=True))


        max = len(tasks)/len(profiles)
        print len(tasks)
        print len(profiles)
        print max

        for profile in profiles:
            user = profile.user
            count = 0
            print user
            if max == 0:
                for task in tasks:
                    task.assignee = user
                    task.save(force_update=True)
                    print task
            while count < max and len(tasks) > 0:
                task = tasks.pop()
                task.assignee = user
                task.save(force_update=True)
                count += 1
                print count

        return
