# -*- coding: utf-8 -*-

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandError

from stages.models import Stage
from tasks.models import Task
from task_status.models import TaskStatus
from task_types.models import TaskType
from forms.models import FormData, PersistentFormData
from guilds.models import Guild
from stages.models import Stage
from user_profiles.models import UserProfile

import csv
import pdb
import io
import re

class Command(BaseCommand):
    help = 'Does some magical work'

    def handle(self, *args, **options):
        exported_data = []
        mothers = []
        fathers = []

        with open('/home/ubuntu/dost_mobiles.csv') as f:
            rows = csv.reader(f)
            count = 0            

            for row in rows:
                print row
                mobile = re.findall('\d{10}', row[0])[0]
                user = User.objects.get(profile__mobile=mobile)

                pfd = PersistentFormData.objects.get(beneficiary=user)
                
                if len(mothers) < 5000:
                    if 'Mother Details' in pfd.data.keys():
                        md = pfd.data['Mother Details']
                        
                        if 'Mobile' in md.keys() and len(pfd.data['Mother Details']['Mobile']) >= 10:
                            mothers.append(user)
                elif len(fathers) < 2000:
                    if user not in mothers:
                        if 'Father Details' in pfd.data.keys():
                            fd = pfd.data['Father Details']
                            
                            if 'Mobile' in fd.keys():
                                fathers.append(user)

                else:
                    print len(mothers)
                    print len(fathers)
                    break

        print len(mothers)

        md = []
        fd = []
        for user in mothers:
            mr = {}
            pfd = PersistentFormData.objects.get(beneficiary=user)
            mobile = pfd.data['Mother Details']['Mobile']
            mr['mobile'] = mobile
            md.append(mr)

        keys = md[0].keys()

        with open('dost_mothers.csv', 'wb') as f:
            dict_writer = csv.DictWriter(f, keys)
            dict_writer.writeheader()
            dict_writer.writerows(md)

        for user in fathers:
            fr = {}
            pfd = PersistentFormData.objects.get(beneficiary=user)
            mobile = pfd.data['Father Details']['Mobile']
            fr['mobile'] = mobile
            fd.append(fr)

        keys = fd[0].keys()

        with open('dost_fathers.csv', 'wb') as f:
            dict_writer = csv.DictWriter(f, keys)
            dict_writer.writeheader()
            dict_writer.writerows(fd)
        
            


                    
                        
