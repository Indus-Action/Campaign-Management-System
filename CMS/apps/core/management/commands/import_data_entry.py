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
        with open('/home/ubuntu/data_entry.csv') as f:
            rows = csv.reader(f)

            count = 0
            count_success = 0
            pf = PersistentForm.objects.last()
            # task_type = TaskType.objects.get(task_type="Sent to CC")
            task_status = TaskStatus.objects.get(status="Sent to CC")
            task_status_final = TaskStatus.objects.get(status="Call Success")

            max_count = 0

            for row in rows:
                try:
                    count += 1
                    print count

                    # Reading data...
                    entry_date = datetime.strptime(row[0], '%d/%m/%Y')
                    ss_name = row[1].strip()
                    ss_calling_date = datetime.strptime(row[2], '%d/%m/%Y')
                    ss_guild_name = row[3].strip()
                    family_mobile = row[5]
                    family_dob = datetime.strptime('01/01/1970', '%d/%m/%Y')
                    try:
                        family_dob = datetime.strptime('01/01/1970', '%d/%m/%Y') if row[6].strip()=='' else datetime.strptime(row[6].strip(), '%d/%m/%Y')
                    except:
                        print 'Skipping DOB'
                    family_name = row[7]

                    family_birth_proof = {}
                    family_birth_proof['1'] = row[8]
                    family_birth_proof['2'] = row[9]
                    family_birth_proof['3'] = row[10]
                    family_birth_proof['4'] = row[11]

                    family_address_proof = {}
                    family_address_proof['1'] = row[12]
                    family_address_proof['2'] = row[13]
                    family_address_proof['3'] = row[14]

                    family_ews = {}
                    family_ews['1'] = row[15]
                    family_ews['2'] = row[16]

                    family_scst = row[17]
                    family_obc = row[18]
                    family_orphan = row[19]
                    family_disabled = row[20]
                    family_whatsapp = row[21]

                    call_status = row[22]

                    # Mapping Objects...
                    try:
                        family = UserProfile.objects.get(mobile=family_mobile)
                    except ObjectDoesNotExist:
                        try:
                            family_mobile = "0" + family_mobile
                            family = UserProfile.objects.get(mobile=family_mobile)
                        except ObjectDoesNotExist:
                            family = UserProfile.objects.create(mobile=family_mobile,
                                                       user_type='BN')
                            family.stage = Stage.objects.get(name='Identification')
                            family.user = User.objects.create(username=family_mobile)
                            family.user.save()
                            family.save()
                            Tag.objects.get(tag='CC Number NE').users.add(family.user)

                    try:
                        ss = UserProfile.objects.get(user__first_name=ss_name, guild__name=ss_guild_name)
                    except ObjectDoesNotExist:
                        ss = None
                        raise ValueError('Failed to get SS')

                    # Mapping Data
                    try:
                        pfd, pfd_created = PersistentFormData.objects.get_or_create(form=pf, beneficiary=family.user)
                        data = pfd.data

                        if not 'Father Details' in data:
                            father_details = {}
                            father_details["Name"] = family_name
                            father_details["Occupation"] = ""
                            father_details["Mobile"] = family_mobile
                            if family_whatsapp == '1':
                                father_details["Whatsapp"] = 'yes'
                            else:
                                father_details["Whatsapp"] = ''
                            father_details["Aadhar Card Number"] = ""
                            data['Father Details'] = father_details
                        else:
                            if not 'Name' in data['Father Details']:
                                data['Father Details']["Name"] = family_name
                            if not 'Mobile' in data['Father Details']:
                                data['Father Details']["Mobile"] = family_mobile
                            if not 'Whatsapp' in data['Father Details'] or data['Father Details']["Whatsapp"] == 'no':
                                if family_whatsapp == '1':
                                    data['Father Details']["Whatsapp"] = 'yes'

                        if family_dob:
                            if 'Children' in data:
                                if data['Children'][0]:
                                    if not data['Children'][0]['Date of Birth']:
                                        data['Children'][0]['Date of Birth'] = family_dob.isoformat()
                                else:
                                    child = {}
                                    child['Name'] = ''
                                    child['Gender'] = ''
                                    child['Date of Birth'] = family_dob.isoformat()
                                    data['Children'] = [child]
                            else:
                                child = {}
                                child['Name'] = ''
                                child['Gender'] = ''
                                child['Date of Birth'] = family_dob.isoformat()
                                data['Children'] = [child]

                        if not 'Documentation' in data:
                            documentation = {}

                            birth_proof = {}
                            birth_proof["Anganwadi Record"] = ""
                            birth_proof["Birth Certificate"] = ""
                            birth_proof["Hospital Record"] = ""
                            birth_proof["Self Affidavit"] = ""
                            if family_birth_proof['1'] == '1':
                                birth_proof["Anganwadi Record"] = 1
                            if family_birth_proof['2'] == '1':
                                birth_proof["Hospital Record"] = 1
                            if family_birth_proof['3'] == '1':
                                birth_proof["Self Affidavit"] = 1
                            if family_birth_proof['4'] == '1':
                                birth_proof["Birth Certificate"] = 1
                            documentation['Birth Certificate'] = birth_proof

                            address_proof = {}
                            address_proof["Aadhar Card"] = ""
                            address_proof["License"] = ""
                            address_proof["Electricity/Water Bill"] = ""
                            if family_address_proof['1'] == '1':
                                address_proof["Aadhar Card"] = 1
                            if family_address_proof['2'] == '1':
                                address_proof["License"] = 1
                            if family_address_proof['3'] == '1':
                                address_proof["Electricity/Water Bill"] = 1
                            documentation['Address Proof'] = address_proof

                            ews_proof = {}
                            ews_proof["Income Certicate"] = ""
                            ews_proof["AAY Ration Card (PINK)"] = ""
                            if family_ews['1'] == '1':
                                ews_proof["Income Certicate"] = 1
                            if family_ews['2'] == '1':
                                ews_proof["AAY Ration Card (PINK)"] = 1
                            documentation["Income Certificate"] = ews_proof

                            category_proof = {}
                            category_proof["Delhi Caste Certificate"] = ""
                            if family_scst == '1' or family_obc == '1':
                                category_proof["Delhi Caste Certificate"] = 1
                            documentation["Category Certificate"] = category_proof

                            disability_proof = {}
                            disability_proof["Govt. Medical Certificate"] = ""
                            if family_disabled == '1':
                                disability_proof["Govt. Medical Certificate"] = 1
                            documentation["Disability Certificate"] = disability_proof

                            orphan_proof = {}
                            orphan_proof["CWC Certificate"] = ""
                            if family_orphan == '1':
                                orphan_proof["CWC Certificate"] = 1
                            documentation["Orphan Certificate"] = orphan_proof

                            data['Documentation'] = documentation

                        else:
                            if not 'Birth Certificate' in data['Documentation']:
                                birth_proof = {}
                                birth_proof["Anganwadi Record"] = ""
                                birth_proof["Birth Certificate"] = ""
                                birth_proof["Hospital Record"] = ""
                                birth_proof["Self Affidavit"] = ""
                                data['Documentation']['Birth Certificate'] = birth_proof
                            if family_birth_proof['1'] == '1':
                                data['Documentation']['Birth Certificate']["Anganwadi Record"] = 1
                            if family_birth_proof['2'] == '1':
                                data['Documentation']['Birth Certificate']["Hospital Record"] = 1
                            if family_birth_proof['3'] == '1':
                                data['Documentation']['Birth Certificate']["Self Affidavit"] = 1
                            if family_birth_proof['4'] == '1':
                                data['Documentation']['Birth Certificate']["Birth Certificate"] = 1

                            if not 'Address Proof' in data['Documentation']:
                                address_proof = {}
                                address_proof["Aadhar Card"] = ""
                                address_proof["License"] = ""
                                address_proof["Electricity/Water Bill"] = ""
                                data['Documentation']['Address Proof'] = address_proof
                            if family_address_proof['1'] == '1':
                                data['Documentation']['Address Proof']["Aadhar Card"] = 1
                            if family_address_proof['2'] == '1':
                                data['Documentation']['Address Proof']["License"] = 1
                            if family_address_proof['3'] == '1':
                                data['Documentation']['Address Proof']["Electricity/Water Bill"] = 1

                            if not 'Income Certificate' in data['Documentation']:
                                ews_proof = {}
                                ews_proof["Income Certicate"] = ""
                                ews_proof["AAY Ration Card (PINK)"] = ""
                                data['Documentation']['Income Certificate'] = ews_proof
                            if family_ews['1'] == '1':
                                data['Documentation']['Income Certificate']["Income Certicate"] = 1
                            if family_ews['2'] == '1':
                                data['Documentation']['Income Certificate']["AAY Ration Card (PINK)"] = 1

                            if not "Category Certificate" in data['Documentation']:
                                category_proof = {}
                                category_proof["Delhi Caste Certificate"] = ""
                                data['Documentation']["Category Certificate"] = category_proof
                            if family_scst == '1' or family_obc == '1':
                                data['Documentation']["Category Certificate"]["Delhi Caste Certificate"] = 1

                            if not "Disability Certificate" in data['Documentation']:
                                disability_proof = {}
                                disability_proof["Govt. Medical Certificate"] = ""
                                data['Documentation']["Disability Certificate"] = disability_proof
                            if family_disabled == '1':
                                data['Documentation']["Disability Certificate"]["Govt. Medical Certificate"] = 1

                            if not "Orphan Certificate" in data['Documentation']:
                                orphan_proof = {}
                                orphan_proof["CWC Certificate"] = ""
                                data['Documentation']["Orphan Certificate"] = orphan_proof
                            if family_orphan == '1':
                                data['Documentation']["Orphan Certificate"]["CWC Certificate"] = 1
                        pfd.data = data
                        pfd.save()

                        beneficiary = family.user
                        print beneficiary.id
                        ss_user = ss.user
                        try:
                            task = Task.objects.get(beneficiary=beneficiary, start_date=ss_calling_date)
                        except (ObjectDoesNotExist, MultipleObjectsReturned):
                            try:
                                task = Task.objects.get(status=task_status, beneficiary=beneficiary)
                            except:
                                try:
                                    temp_task_type = TaskType.objects.get(task_type=beneficiary.profile.stage.name)
                                except:
                                    temp_task_type = TaskType.objects.get(task_type='Identification')
                                task = Task.objects.create(status=task_status, beneficiary=beneficiary, task_type=temp_task_type)

                        if call_status:
                            # A = Not Responding
                            if call_status=='A':
                                task_status_final = TaskStatus.objects.get(status='Not Responding')
                            # B = Busy
                            elif call_status=='B':
                                task_status_final = TaskStatus.objects.get(status='Busy')
                            # C = Call Rejected
                            elif call_status=='C':
                                task_status_final = TaskStatus.objects.get(status='Call Rejected')
                            # D = Call Later
                            elif call_status=='D':
                                task_status_final = TaskStatus.objects.get(status='Call Later')
                            # E = Wrong Number
                            elif call_status=='E':
                                task_status_final = TaskStatus.objects.get(status='Call Rejected')
                                Tag.objects.get(tag='Wrong Number').users.add(beneficiary)
                            # F = Switched Off
                            elif call_status=='F':
                                task_status_final = TaskStatus.objects.get(status='Switched Off')
                            # G = Admitted last year
                            elif call_status=='G':
                                task_status_final = TaskStatus.objects.get(status='Call Done')
                                if beneficiary.profile.stage != Stage.objects.get(name='Applied'):
                                    family.stage = Stage.objects.get(name='Ineligible')
                            # H = <3 years
                            elif call_status=='H':
                                task_status_final = TaskStatus.objects.get(status='Call Done')
                                family.stage = Stage.objects.get(name='Ineligible')
                                Tag.objects.get(tag='Age < 3').users.add(beneficiary)
                                Tag.objects.get(tag='Next Year Applicant').users.add(beneficiary)
                            # I = >6 years
                            elif call_status=='I':
                                task_status_final = TaskStatus.objects.get(status='Call Done')
                                family.stage = Stage.objects.get(name='Ineligible')
                                Tag.objects.get(tag='Age > 6').users.add(beneficiary)
                            # 1 = Docs not completed - Documentation
                            elif call_status=='1':
                                task_status_final = TaskStatus.objects.get(status='Call Done')
                                if beneficiary.profile.stage == Stage.objects.get(name='Identification'):
                                    family.stage = Stage.objects.get(name='Documentation')
                            # 2 = Docs completed - Application
                            elif call_status=='2':
                                task_status_final = TaskStatus.objects.get(status='Call Success')
                                if beneficiary.profile.stage!=Stage.objects.get(name='Applied'):
                                    family.stage = Stage.objects.get(name='Application')
                            # 3 = Applied
                            elif call_status=='3':
                                task_status_final = TaskStatus.objects.get(status='Call Success')
                                family.stage = Stage.objects.get(name='Applied')
                                Tag.objects.get(tag='Applied').users.add(beneficiary)
                        else:
                            task_status_final = TaskStatus.objects.get(status='Call Done')
                            birth_doc_count = 0
                            address_doc_count = 0
                            other_doc_count = 0
                            for field in family_birth_proof:
                                birth_doc_count += int(1 if family_birth_proof[field]=='1' else 0)
                            for field in family_address_proof:
                                address_doc_count += int(1 if family_address_proof[field]=='1' else 0)
                            for field in family_ews:
                                other_doc_count += int(1 if family_ews[field]=='1' else 0)
                            other_doc_count += int(1 if family_scst=='1' else 0) + int(1 if family_obc=='1' else 0) + int(1 if family_orphan=='1' else 0) + int(1 if family_disabled=='1' else 0)

                            if birth_doc_count and address_doc_count and other_doc_count:
                                if beneficiary.profile.stage != Stage.objects.get(name='Applied'):
                                    family.stage = Stage.objects.get(name='Application')
                            else:
                                if beneficiary.profile.stage != Stage.objects.get(name='Applied') and beneficiary.profile.stage != Stage.objects.get(name='Application'):
                                    family.stage = Stage.objects.get(name='Documentation')

                        family.save()
                        beneficiary.save()
                        Tag.objects.get(tag='Data Entry CC').users.add(beneficiary)
                        task.assignee = ss_user
                        task.status = task_status_final
                        task.start_date = ss_calling_date
                        task.due_date = ss_calling_date
                        task.save()
                        # print data

                    except ObjectDoesNotExist as err:
                        print err
                        print traceback.format_exc()

                except ValueError as err:
                    print err
                    print traceback.format_exc()
