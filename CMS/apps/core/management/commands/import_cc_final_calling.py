# -*- coding: utf-8 -*-

from django.core.management.base import BaseCommand, CommandError
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned

from tags.models import Tag
from stages.models import Stage
from tasks.models import Task
from task_types.models import TaskType
from task_status.models import TaskStatus
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
        with open('/home/ubuntu/data_CC_final.csv') as f:
            rows = csv.reader(f)

            count = 0
            pf = PersistentForm.objects.last()

            for row in rows:
                try:
                    count += 1
                    print count

                    # Reading data...
                    ss_name = row[0].strip()
                    mobile = row[1].strip()
                    dob = datetime.strptime('01/01/1970', '%d/%m/%Y') if row[2].strip()=='' else datetime.strptime(row[2].strip(), '%d/%m/%Y')
                    applied = row[3].strip()
                    not_applied = row[4].strip()
                    ls = row[5].strip()
                    lf = row[6].strip()
                    admitted = row[7].strip()
                    admitted16 = row[8].strip()
                    not_eligible = row[9].strip()

                    # Mapping Objects...
                    try:
                        family = UserProfile.objects.get(mobile=mobile)
                    except ObjectDoesNotExist:
                        try:
                            mobile = "0" + mobile
                            family = UserProfile.objects.get(mobile=mobile)
                        except ObjectDoesNotExist:
                            family = UserProfile.objects.create(mobile=mobile,
                                                       user_type='BN')
                            family.stage = Stage.objects.get(name='Identification')
                            family.user = User.objects.create(username=mobile)
                            family.user.save()
                            family.save()
                            Tag.objects.get(tag='CC Number NE').users.add(family.user)

                    # Mapping Data
                    try:
                        pfd, pfd_created = PersistentFormData.objects.get_or_create(form=pf, beneficiary=family.user)
                        data = pfd.data
                        if dob:
                            if 'Children' in data:
                                if data['Children'][0]:
                                    if not data['Children'][0]['Date of Birth']:
                                        data['Children'][0]['Date of Birth'] = dob.isoformat()
                                else:
                                    child = {}
                                    child['Name'] = ''
                                    child['Gender'] = ''
                                    child['Date of Birth'] = dob.isoformat()
                                    data['Children'] = [child]
                            else:
                                child = {}
                                child['Name'] = ''
                                child['Gender'] = ''
                                child['Date of Birth'] = dob.isoformat()
                                data['Children'] = [child]
                        pfd.data = data
                        pfd.save()

                        beneficiary = family.user
                        print beneficiary.id

                        Tag.objects.get(tag='Data Entry CC 2').users.add(beneficiary)

                        if applied == '1':
                            Tag.objects.get(tag='Applied').users.add(beneficiary)
                        if not_applied == '1':
                            Tag.objects.get(tag='Form Not Applied').users.add(beneficiary)
                        if ls == '1':
                            Tag.objects.get(tag='Lottery Success').users.add(beneficiary)
                        if lf == '1':
                            Tag.objects.get(tag='Lottery Failure').users.add(beneficiary)
                            Tag.objects.get(tag='Lottery 1 Failure').users.add(beneficiary)
                        if admitted == '1':
                            Tag.objects.get(tag='Admitted 2017').users.add(beneficiary)
                        if admitted16 == '1':
                            Tag.objects.get(tag='Admitted 2016 Non IA').users.add(beneficiary)
                        if not_eligible == '1':
                            Tag.objects.get(tag='Not Eligible').users.add(beneficiary)

                        family.save()
                        beneficiary.save()
                        # print data

                    except ObjectDoesNotExist as err:
                        print err
                        print traceback.format_exc()

                except ValueError as err:
                    print err
                    print traceback.format_exc()
