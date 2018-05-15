# -*- coding: utf-8 -*-

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandError

from stages.models import Stage
from tasks.models import Task
from task_status.models import TaskStatus
from task_types.models import TaskType
from forms.models import FormData
from guilds.models import Guild
from stages.models import Stage
from user_profiles.models import UserProfile
from tags.models import Tag

import csv
import pdb

class Command(BaseCommand):
    help = 'Does some magical work'

    def handle(self, *args, **options):
        exported_data = []

        # ups = UserProfile.objects.filter(stage=Stage.objects.get(name='Applied')).exclude(user__tags__in=[Tag.objects.get(tag='Data Export Progress')]).all()
        ups = UserProfile.objects.filter(stage__name='Applied').exclude(user__tags__in=[Tag.objects.get(tag='Lottery Success')]).exclude(user__tags__in=[Tag.objects.get(tag='Lottery Failure')]).exclude(user__tags__in=[Tag.objects.get(tag='Admitted 2017')])
        # ups = UserProfile.objects.filter(user__tags__in=[Tag.objects.get(tag='Fuzzy Match 95')])
        # ups = UserProfile.objects.filter(user__tags__in=[Tag.objects.get(tag='Admitted 2017')])

        count = 0
        for up in ups:
            # print up.user
            Tag.objects.get(tag='Data Export Progress').users.add(up.user)
            record = {}
            count += 1
            print count
            record['Mobile'] = up.mobile
            record['Reg Number'] = ''
            # record['Gender'] = ''

            try:
                if up.user.persistent_data and 'Children' in up.user.persistent_data.data and len(up.user.persistent_data.data['Children']) and 'Registration Number' in up.user.persistent_data.data['Children'][0]:
                # if up.user.persistent_data and 'Children' in up.user.persistent_data.data and len(up.user.persistent_data.data['Children']):
                    '''
                    for child in up.user.persistent_data.data['Children']:
                        record['Gender'] = ''
                        if 'Gender' in child:
                            record['Gender'] = child['Gender']
                        exported_data.append(record)
                    '''
                    record['Reg Number'] = up.user.persistent_data.data['Children'][0]['Registration Number']
            except AttributeError:
                print 'Some key missing...'
            exported_data.append(record)

        keys = exported_data[0].keys()

        with open('ID_numbers.csv', 'wb') as f:
            dict_writer = csv.DictWriter(f, keys)
            dict_writer.writeheader()
            dict_writer.writerows(exported_data)

