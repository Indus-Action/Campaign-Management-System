# -*- coding: utf-8 -*-

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandError

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
        with open('/home/ubuntu/wardwise_EWS_data-1.csv') as f:
            rows = csv.reader(f)
            identification = Stage.objects.get(pk=2)

            for row in rows:
                mobile = row[24]
                up, created = UserProfile.objects.get_or_create(mobile='0' + str(mobile))
                user = up.user
                if not user:
                    user, user_created = User.objects.get_or_create(username=up.mobile)
                    up.user = user
                    up.stage = identification
                    up.save()
                mcd = Tag.objects.get(tag='MCD')
                mcd.users.add(user)
