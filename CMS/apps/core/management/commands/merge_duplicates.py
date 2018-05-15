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
        users = User.objects.all()
        ups = UserProfile.objects.all()

        count = 0
        unique_profiles = {}
        pf = PersistentForm.objects.last()

        for up in ups:
            search_mobile = ''
            if len(up.mobile) == 10:
                search_mobile = '0' + up.mobile
            elif len(up.mobile) == 11:
                search_mobile = up.mobile[1:]
            else:
                continue
            d_ups = UserProfile.objects.filter(Q(mobile=up.mobile) | Q(mobile=search_mobile))
            
            s_up = None
            max_l = -1

            for d_up in d_ups:
                if not d_up.user:
                    continue
                pfd, created = PersistentFormData.objects.get_or_create(beneficiary=d_up.user, form=pf)

                if len(json.dumps(pfd.data)) > max_l:
                    max_l = len(json.dumps(pfd.data))
                    s_up = d_up
            if s_up:
                for d_up in d_ups:
                    if not d_up.user:
                        continue
                    pfd = PersistentFormData.objects.get(beneficiary=d_up.user)                
                    pfd.data = copy.deepcopy(s_up.user.persistent_data.data)
                    pfd.save()

                
