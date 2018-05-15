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
        with open('/home/ubuntu/reg_data_hl.csv') as f:
            rows = csv.reader(f)
            applied = Stage.objects.get(name='Applied')
            count = 0
            pf = PersistentForm.objects.last()

            for row in rows:
                count += 1
                print count

                # Reading data
                child_name = row[0]
                mobile = row[1]
                reg_num = row[2]
                aadhaar = row[3]
                mother_name = row[4]
                father_name = row[5]
                dob =  datetime.strptime('01/01/1970', '%d/%m/%Y') if row[6].strip()=='' else datetime.strptime(row[6].strip(), '%d/%m/%Y')

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
                        up.stage = applied
                        up.user = User.objects.create(username=mobile)
                        up.user.save()
                        up.save()
                        Tag.objects.get(tag='CC Number NE').users.add(up.user)

                pfd, pfd_created = PersistentFormData.objects.get_or_create(form=pf, beneficiary=up.user)
                data = pfd.data

                if 'Children' in data:
                    if len(data['Children']) == 0:
                        child = {}
                        child['Name'] = child_name
                        child['Gender'] = ''
                        child['Date of Birth'] = dob.isoformat()
                        child['Registration Number'] = reg_num
                        child['Aadhar Card Number'] = aadhaar
                        data['Children'] = [child]
                    else:
                        req_child = None
                        for ch in data['Children']:
                            if ch['Name'] == child_name:
                                req_child = ch
                                break
                        if not req_child:
                            req_child = data['Children'][0]
                        if not ('Name' in req_child and req_child['Name'] != ''):
                            req_child['Name'] = child_name
                        if not ('Registration Number' in req_child and req_child['Registration Number'] != ''):
                            req_child['Registration Number'] = reg_num
                        if not ('Aadhar Card Number' in req_child and req_child['Aadhar Card Number'] != ''):
                            req_child['Aadhar Card Number'] = aadhaar

                else:
                    child = {}
                    child['Name'] = child_name
                    child['Gender'] = ''
                    child['Date of Birth'] = dob.isoformat()
                    child['Registration Number'] = reg_num
                    child['Aadhar Card Number'] = aadhaar
                    data['Children'] = [child]

                pfd.data = data
                pfd.save()

                if not up.stage or up.stage.name in ['Identification', 'Documentation', 'Application', 'Ineligible']:
                    print 'Changing to Applied'
                    up.stage = applied
                    Tag.objects.get(tag='Applied').users.add(up.user)
                    up.save()
