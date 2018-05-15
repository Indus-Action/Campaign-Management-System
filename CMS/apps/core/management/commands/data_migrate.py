# -*- coding: utf-8 -*-

from django.core.management.base import BaseCommand, CommandError

from tags.models import Tag
from stages.models import Stage
from user_profiles.models import UserProfile
from django.contrib.auth.models import User
from vms2.settings.base import BASE_DIR
from forms.models import PersistentForm, PersistentFormData

import json
import csv
import traceback

import pdb

from datetime import datetime


class Command(BaseCommand):
    help = 'Does some magical work'

    def handle(self, *args, **options):
        with open('/home/ubuntu/migrate_6Dec.csv') as f:
            rows = csv.reader(f, quotechar="'", delimiter='$')

            count = 0
            count_success = 0
            pf = PersistentForm.objects.last()

            count = 0
            max_count = 0

            for row in rows:
                count += 1
                print count
                mobile = row[42]
                user = None
                user_profile = None
                if len(mobile) == 11:
                    mobile = mobile[1:]

                if len(mobile) != 10:
                    continue

                try:
                    user = User.objects.get(username=mobile)
                    user_profile, profile_created = UserProfile.objects.get_or_create(mobile=mobile)
                    if profile_created:
                        user.profile = user_profile
                        user.save()
                        user_profile.user = user
                        user_profile.save()
                except:
                    user_profile, profile_created = UserProfile.objects.get_or_create(mobile=mobile)

                    if user_profile.user:
                        user = user_profile.user
                    else:
                        user, user_created = User.objects.get_or_create(username=mobile)
                        user_profile.user = user
                        user_profile.save()

                try:
                    if user and user_profile:
                        pfd, pfd_created = PersistentFormData.objects.get_or_create(form=pf, beneficiary=user)

                        data = pfd.data
                        father_details = {
                            "Name": row[12],
                            "Occupation": row[39],
                            "Mobile": row[42]
                        }
                        data['Father Details'] = father_details
                        mother_details = {
                            "Name": row[47],
                            "Occupation": row[27],
                            "Mobile": row[2]
                        }
                        data['Mother Details'] = mother_details
                        data['Category'] = row[37]
                        children = []

                        if 'Children' in data.keys():
                            children = data['Children']
                        else:
                            children = []

                        if row[28]:
                            child = {}
                            child['Name'] = row[28]
                            child['Gender'] = row[21]
                            if row[51]:
                                try:
                                    child['Date of Birth'] = datetime.strptime(row[51], '%Y-%m-%dT%H:%M:%S.%fZ').date().isoformat()
                                except:
                                    pass
                                children.append(child)
                                data['Children'] = children

                        documentation = {}
                        birth = {}
                        if row[0]:
                            birth = json.loads(row[0])

                        address = {}
                        if row[40]:
                            print row
                            address = json.loads(row[40])

                        category_dict = {}
                        if row[15]:
                            category_dict = json.loads(row[15])

                        income = {}
                        if row[48]:
                            print row
                            income = json.loads(row[48])

                        orphan = {}
                        if row[4]:
                            orphan = json.loads(row[4])

                        disabled = {}
                        if row[7]:
                            disabled = json.loads(row[7])

                        if address:
                            address_dict = {}
                            for key in address.keys():
                                if key == 'aadhar' and address[key]:
                                    address_dict['Aadhar Card'] = 1
                                if key == 'ration' and address[key]:
                                    address_dict['Ration Card'] = 1
                                if key == 'voter' and address[key]:
                                    address_dict['Voter Card'] = 1
                                if key == 'license' and address[key]:
                                    address_dict['License'] = 1
                                if key == 'bill' and address[key]:
                                    address_dict['Electricity/Water Bill'] = 1

                            documentation['Address Proof'] = address_dict

                        if birth:
                            birth_dict = {}
                            for key in birth.keys():
                                if key == 'hospital' and birth[key]:
                                    birth_dict['Hospital Record'] = 1
                                if key == 'anganwadi' and birth[key]:
                                    birth_dict['Anganwadi Record'] = 1
                                if key == 'birth' and birth[key]:
                                    birth_dict['Birth Certificate'] = 1
                                if key == 'self' and birth[key]:
                                    birth_dict['Self Affidavit'] = 1

                            documentation['Birth Certificate'] = birth_dict

                        if income:
                            income_dict = {}
                            for key in income.keys():
                                if key == 'food' and income[key]:
                                    income_dict['Food Security Card (GREEN)'] = 1
                                if key == 'ration' and income[key]:
                                    income_dict['AAY Ration Card (PINK)'] = 1
                                if key == 'income' and income[key]:
                                    income_dict['Income Certificate'] = 1
                                if key == 'bpl' and income[key]:
                                    income_dict['BPL Card (YELLOW)'] = 1

                            documentation['Income Certificate'] = income_dict

                        if orphan:
                            orphan_dict = {}
                            for key in orphan.keys():
                                if key == 'orphan' and orphan[key]:
                                    orphan_dict['CWC Certificate'] = 1

                            documentation['Orphan Certificate'] = orphan_dict

                        if disabled:
                            disabled_dict = {}
                            for key in disabled.keys():
                                if key == 'medical' and disabled[key]:
                                    orphan_dict['Govt. Medical Certificate'] = 1

                            documentation['Disability Certificate'] = orphan_dict
                        
                        data['Documentation'] = documentation

                        pfd.data = data
                        print pfd.data
                        pfd.save()
                        print pfd.id
                except Exception, e:
                    print count
                    print(traceback.format_exc())
                    break
