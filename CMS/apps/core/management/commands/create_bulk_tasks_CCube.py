# -*- coding: utf-8 -*-

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from django.db.models import Q

from stages.models import Stage
from tasks.models import Task
from tags.models import Tag
from task_status.models import TaskStatus
from task_types.models import TaskType
from forms.models import FormData
from user_profiles.models import UserProfile
from random import *
import pdb
import csv

class Command(BaseCommand):
    help = 'Does some magical work'

    def handle(self, *args, **options):
        # stage = Stage.objects.get(name="Identification")
        stage = Stage.objects.get(name="Lottery Success")
        # ---stage = Stage.objects.get(name='Ineligible')
        ts = TaskStatus.objects.get(status='Call Not Done')
        # ---ts = TaskStatus.objects.get(status='CC Calling')
        # ts = TaskStatus.objects.get(status='App Drive Calling')
        # tt = TaskType.objects.get(task_type='Fast Nudge')
        # tt = TaskType.objects.get(task_type='Fast Nudge Doc')
        # lr = Tag.objects.get(tag="Lottery Rejected")
        # decc = Tag.objects.get(tag="Data Entry CC")
        # extag = Tag.objects.get(tag='Data Entry CC TC')

        # users = User.objects.filter(tags__in=[lr], profile__stage=stage).exclude(beneficiary_tasks__task_type=tt) #[:6000]
        # users = User.objects.filter(tags__in=[decc]).exclude(tags__in=[extag]).exclude(beneficiary_tasks__status=ts).exclude(profile__stage=stage)[:6000]
        # users = User.objects.filter(tags__in=[decc]).exclude(beneficiary_tasks__status=ts)
        # users = User.objects.filter(profile__stage=stage).exclude(beneficiary_tasks__task_type=TaskType.objects.get(task_type='Lottery Success')).exclude(tags__in=[Tag.objects.get(tag='Admitted 2017')])
        # users = User.objects.filter(profile__stage__name='Application').filter(tags__in=[Tag.objects.get(tag='Fuzzy Match 80')]).exclude(beneficiary_tasks__task_type=TaskType.objects.get(task_type='Lottery Success')).exclude(tags__in=[Tag.objects.get(tag='Admitted 2017')]).exclude(beneficiary_tasks__status=TaskStatus.objects.get(status='Import Success'))
        # users = User.objects.filter(profile__stage__name='Applied').exclude(tags__in=[Tag.objects.get(tag='Lottery Success')]).exclude(tags__in=[Tag.objects.get(tag='Lottery Failure')]).exclude(tags__in=[Tag.objects.get(tag='Admitted 2017')]).exclude(tags__in=[Tag.objects.get(tag='Form Not Applied')])


        print "Starting the Task Creation"
        users=User.objects.filter(tags__in=[Tag.objects.get(tag='Lottery Rejected')]).exclude(tags__in=[Tag.objects.get(tag='Lottery Success')])

        print users.count()

        print "The total number of admitted in 2016 are "+str(users.count())

        user_random=sample(users,100)
        task_objs=[]
        user_naveen=User.objects.get(email='naveen@indusaction.org')
        user_rakhi=User.objects.get(email='rakhi@indusaction.org')
        user_gayatree=User.objects.get(email='gayatree@indusaction.org')


        naveen_threshold=45
        rakhi_threshold=45
        gayatree_threshold=10
        count=1

        for user in user_random:
            tt = TaskType.objects.get(task_type='CC L Fail Survey')
            ts = TaskStatus.objects.get(status='Call Not Done')




            if count<=10:

                task = Task(status=ts, task_type=tt, beneficiary=user,assignee=user_gayatree)

            if count>10 and count<=55:
                task = Task(status=ts, task_type=tt, beneficiary=user,assignee=user_rakhi)

            if count>55 and count<=100:
                task = Task(status=ts, task_type=tt, beneficiary=user,assignee=user_naveen)

            task_objs.append(task)
            count=count+1

        Task.objects.bulk_create(task_objs)
        print "Task creation complete"