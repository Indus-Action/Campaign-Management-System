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
import pdb
import csv
from random import *

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
        task_objs=[]
        users = User.objects.filter(tags__in=[Tag.objects.get(tag='IA 2017 Missing Form')])


        user_mahender=User.objects.get(email='mahender@indusaction.org')
        tt = TaskType.objects.get(task_type='Identification')
        ts = TaskStatus.objects.get(status='Call Not Done')
        stage=Stage.objects.get(name='Identification')


        for user in users:

            try:
                profile=user.profile
                profile.stage=stage
                profile.save(force_update=True)
                task = Task(status=ts, task_type=tt, beneficiary=user,assignee=user_mahender)
                task.save()
                task_objs.append(task)
            except:
                print "Failed in task creation"
                
            
        #Task.objects.bulk_create(task_objs)
        print "The total tasks are "+str(len(task_objs))