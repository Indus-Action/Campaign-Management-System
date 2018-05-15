# -*- coding: utf-8 -*-

from django.core.management.base import BaseCommand, CommandError

from tags.models import Tag
from tasks.models import Task
from stages.models import Stage
from user_profiles.models import UserProfile
from django.contrib.auth.models import User
from vms2.settings.base import BASE_DIR
from django.db.models import Q
from forms.models import PersistentFormData, PersistentForm

import json
import csv
import copy


class Command(BaseCommand):
    help = 'Does some magical work'

    def handle(self, *args, **options):
        ups = UserProfile.objects.all()
        
        for up in ups:
            search_mobile = ''
            if len(up.mobile) == 10:
                search_mobile = '0' + up.mobile
            elif len(up.mobile) == 11:
                search_mobile = up.mobile[1:]
            else:
                continue
            d_ups = UserProfile.objects.filter(Q(mobile=up.mobile) | Q(mobile=search_mobile))
            
            users = []
            for d_up in d_ups:
                users.append(d_up.user)
                
            d_ups = list(d_ups)
            d_ups = sorted(d_ups, key=lambda x: len(x.mobile), reverse=True)
            s_up = d_ups.pop()

            if len(d_ups) > 0:
                tasks = Task.objects.filter(assignee__in=users)
                for task in tasks:
                    task.assignee = s_up.user

                for d_up in d_ups:
                    user = d_up.user
                    try:
                        user.delete()
                        d_up.delele()
                    except:
                        pass
            
            
