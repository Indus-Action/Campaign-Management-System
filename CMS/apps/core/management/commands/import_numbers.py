# -*- coding: utf-8 -*-

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandError
from django.core.exceptions import ObjectDoesNotExist

from stages.models import Stage
from tasks.models import Task
from task_status.models import TaskStatus
from task_types.models import TaskType
from forms.models import FormData
from guilds.models import Guild
from user_profiles.models import UserProfile
from tags.models import Tag

import csv
import pdb

class Command(BaseCommand):
    help = 'Does some magical work'

    def handle(self, *args, **options):
        with open('/home/ubuntu/applied_numbers.csv') as f:
            rows = csv.reader(f)
            applied = Stage.objects.get(name='Applied')
            count = 0
            count_f1 = 0
            count_f2 = 0
            count_nf = 0

            for row in rows:
                count += 1
                print count
                print count_f1
                print count_f2
                print count_nf

                mobile = row[0]
                try:
                    up = UserProfile.objects.get(mobile=str(mobile))
                    count_f1 += 1
                    print 'found 0'
                except ObjectDoesNotExist:
                    up, created = UserProfile.objects.get_or_create(mobile='0' + str(mobile))
                    count_f2 += 1
                    print 'found/create 1'
                    print created

                user = up.user
                if not user:
                    count_nf += 1
                    user, user_created = User.objects.get_or_create(username=up.mobile)
                    up.user = user
                    up.stage = applied
                    up.save()
                tag = Tag.objects.get(tag='AWD Data')
                tag.users.add(user)
