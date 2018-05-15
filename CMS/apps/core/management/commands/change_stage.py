# -*- coding: utf-8 -*-

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandError
from django.core.exceptions import ObjectDoesNotExist

from stages.models import Stage
from forms.models import FormData
from forms.models import PersistentForm, PersistentFormData
from guilds.models import Guild
from user_profiles.models import UserProfile
from tags.models import Tag

from datetime import datetime

import csv
import pdb

class Command(BaseCommand):
    help = 'Does some magical work'

    def handle(self, *args, **options):
        with open('/home/ubuntu/applied_numbers.csv') as f:
            rows = csv.reader(f)
            ls = Stage.objects.get(name='Applied')
            count = 0
            pf = PersistentForm.objects.last()

            for row in rows:
                count += 1
                print count

                # Reading data
                mobile = row[0]
                # reg_num = row[1]

                try:
                    up = UserProfile.objects.get(mobile=str(mobile))
                    print 'found 0'
                except ObjectDoesNotExist:
                    try:
                        up = UserProfile.objects.get(mobile='0' + str(mobile))
                        print 'found 1'
                    except ObjectDoesNotExist:
                        print 'Not found. Adding'
                        up = UserProfile.objects.create(mobile=mobile, user_type='BN')
                        up.stage = ls
                        up.user = User.objects.create(username=mobile)
                        up.user.save()
                        up.save()
                        Tag.objects.get(tag='CC Number NE').users.add(up.user)

                Tag.objects.get(tag='Lottery Failure').users.add(up.user)
                Tag.objects.get(tag='Lottery 1 Failure').users.add(up.user)
                # Tag.objects.get(tag='Applied').users.add(up.user)
                # Tag.objects.get(tag='Sent to CC 2').users.add(up.user)
                # Tag.objects.get(tag='Fuzzy Match 80').users.add(up.user)
                '''
                if not up.stage or up.stage.name in ['Identification', 'Documentation', 'Application', 'Ineligible']:
                    print 'Changing to Applied'
                    # up.stage = Stage.objects.get(name='Lottery Success')
                    up.stage = ls
                    # Tag.objects.get(tag='Document Ready').users.remove(up.user)
                    # Tag.objects.get(tag='Applied').users.remove(up.user)
                    # Tag.objects.get(tag='Applied').users.add(up.user)
                    # Tag.objects.get(tag='Lottery Failure').users.add(up.user)
                    # Tag.objects.get(tag='Lottery 1 Failure').users.add(up.user)
                    up.save()
                '''
