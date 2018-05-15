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
from tags.models  import Tag
from user_profiles.models import UserProfile
from locations.models import Location

import csv
import pdb

class Command(BaseCommand):
    help = 'Does some magical work'

    def handle(self, *args, **options):
        exported_data = []

        # ups = UserProfile.objects.filter(stage=Stage.objects.get(name='Applied')).exclude(user__tags__in=[Tag.objects.get(tag='Lottery Failure')])
        # ups = UserProfile.objects.filter(stage=Stage.objects.get(name='Lottery Success')).exclude(user__tags__in=[Tag.objects.get(tag='Admitted 2017')])
        # ups = UserProfile.objects.filter(user__tags__in=[Tag.objects.get(tag='Admitted 2017')])
        ups = UserProfile.objects.all()
        # ups = UserProfile.objects.filter(stage__name__in=['Documentation']).exclude(user__tags__in=[Tag.objects.get(tag='Data Export Progress')])[:6000]
        print ups.count()
        count = 0

        return

        for up in ups:
            count += 1
            print count
            try:
                pdata = up.user.persistent_data.data
                data = {}
                data['Mobile'] = up.mobile
                data['Stage'] = up.stage
                data['Tags'] = up.user.tags.all()
                try:
                    data['Father Name'] = pdata['Father Details']['Name'].encode('utf8')
                except:
                    data['Father Name'] = ''
                try:
                    data['Mother Name'] = pdata['Mother Details']['Name'].encode('utf8')
                except:
                    data['Mother Name'] = ''
                try:
                    data['Child'] = pdata['Children'][0]['Name'].encode('utf8')
                except:
                    data['Child'] = ''
                try:
                    data['Reg Number'] = pdata['Children'][0]['Registration Number'].encode('utf8')
                except:
                    data['Reg Number'] = ''
                try:
                    data['Date of Birth'] = pdata['Children'][0]['Date of Birth'].encode('utf8')
                except:
                    data['Date of Birth'] = ''

                try:
                    locality = Location.objects.get(pk=pdata['Address'])
                    try:
                        data['Loc Description'] = locality.description.encode('utf8')
                    except:
                        data['Loc Description'] = ''
                    try:
                        data['Loc Sub 1'] = locality.sublocality_level_1.encode('utf8')
                    except:
                        data['Loc Sub 1'] = ''
                    try:
                        data['Loc Sub 2'] = locality.sublocality_level_2.encode('utf8')
                    except:
                        data['Loc Sub 2'] = ''
                    try:
                        data['Loc Sub 3'] = locality.sublocality_level_3.encode('utf8')
                    except:
                        data['Loc Sub 3'] = ''
                    try:
                        data['Loc Admin 1'] = locality.administrative_area_level_1.encode('utf8')
                    except:
                        data['Loc Admin 1'] = ''
                    try:
                        data['Loc Admin 2'] = locality.administrative_area_level_2.encode('utf8')
                    except:
                        data['Loc Admin 2'] = ''
                    try:
                        data['Loc Locality'] = locality.locality.encode('utf8')
                    except:
                        data['Loc Locality'] = ''
                except:
                    data['Loc Description'] = ''
                    data['Loc Sub 1'] = ''
                    data['Loc Sub 2'] = ''
                    data['Loc Sub 3'] = ''
                    data['Loc Admin 1'] = ''
                    data['Loc Admin 2'] = ''
                    data['Loc Locality'] = ''
                exported_data.append(data)
                # Tag.objects.get(tag='Data Export Progress').users.add(up.user)
            except:
                print 'No PD'

        # pdb.set_trace()
        keys = exported_data[0].keys()

        print count
        with open('stage_data.csv', 'wb') as f:
            dict_writer = csv.DictWriter(f, keys)
            dict_writer.writeheader()
            try:
                dict_writer.writerows(exported_data)
            except:
                print exported_data
