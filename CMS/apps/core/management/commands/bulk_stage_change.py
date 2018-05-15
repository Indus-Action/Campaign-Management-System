# -*- coding: utf-8 -*-

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandError
from django.core.exceptions import ObjectDoesNotExist
from task_status.models import TaskStatus
from stages.models import Stage
from user_profiles.models import UserProfile
from tags.models import Tag
from tasks.models import Task

from datetime import datetime

import csv
import pdb

class Command(BaseCommand):
    help = 'Does some magical work'

    def handle(self, *args, **options):
        with open('/home/ubuntu/LS.csv') as f:
            rows = csv.reader(f)
           # applied = Stage.objects.get(name='Applied')
            count = 0
            tasks = Task.objects.filter(task_type__task_type='Retention Survey')
            print tasks.count()
            for row in rows:
                count += 1
                print count

                # Reading data
                mobile = row[0]
                #reg_numbers = row[1]



                up = UserProfile.objects.filter(mobile=str(mobile))
                print '1'
                print up.count()

                if up.count() == 0:
                    up = UserProfile.objects.filter(mobile='0' + str(mobile))
                    print '2'
                    print up.count()

                if up.count() != 0:
                    print 'Updating the task'
                    print str(mobile)

                    tasks= Task.objects.filter(beneficiary__profile__mobile=str(mobile)).filter(task_type__task_type='Retention Survey')
                    print "Calls done"+str(tasks.count())
                    if tasks.count()!=0:
                        print "Tasks"+str(tasks.count())
                        for task in tasks:
                            ts = TaskStatus.objects.get(status='Call Not Done')
                            print ts
                            ts_new=TaskStatus.objects.get(status='Call Done')
                            task.status=ts_new
                            print task.status
                            task.save(force_update=True)
                            print task

                   
