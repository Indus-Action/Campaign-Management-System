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
from forms.models import PersistentFormData
from locations.models import Location
from datetime import date,datetime


import pdb

import csv, codecs, cStringIO


class DictUnicodeWriter(object):

    def __init__(self, f, fieldnames, dialect=csv.excel, encoding="utf-8", **kwds):
        # Redirect output to a queue
        self.queue = cStringIO.StringIO()
        self.fieldnames = fieldnames
        self.writer = csv.DictWriter(self.queue, fieldnames, dialect=dialect, **kwds)
        self.stream = f
        self.encoder = codecs.getincrementalencoder(encoding)()

    def writerow(self, D):
        self.writer.writerow({k:v.encode("utf-8") for k,v in D.items() if isinstance(v, (str, unicode))})
        # Fetch UTF-8 output from the queue ...
        data = self.queue.getvalue()
        data = data.decode("utf-8")
        # ... and reencode it into the target encoding
        data = self.encoder.encode(data)
        # write to the target stream
        self.stream.write(data)
        # empty queue
        self.queue.truncate(0)

    def writerows(self, rows):
        for D in rows:
            self.writerow(D)

    def writeheader(self):
        header = dict(zip(self.fieldnames, self.fieldnames))
        self.writerow(header)


class Command(BaseCommand):

    def handle(self, *args, **options):



        print "Starting to extract the information"
        user_profile_objects=User.objects.filter(profile__stage__name='Going to School')
   
        print "The total number of user objects are "+str(user_profile_objects.count())
        
        eligible_family_count=0
        eligible_kids_count=0
        data_form_missing_count=0
        children_missing_count=0
        ineligiblie_family_count=0
        inelgibile_children_count=0
        child_date_info_missing_count=0
        more_than_one_form=0
        total_children=0

        boy_count=0
        girl_count=0

        eligible_family=False
        tag_found=False
        export_data=[]
        for user_obj in user_profile_objects:

            
            
            user_form_data=PersistentFormData.objects.filter(beneficiary=user_obj)
            if(user_form_data.count()!=0 and user_form_data is not None):

                if (user_form_data.count()>1):
                    more_than_one_form+=1
            
                if 'Children' in user_form_data[0].data.keys():
                    
                    child_obj=user_form_data[0].data['Children']

                    
                    for child in child_obj:
                        total_children+=1

                        if('Gender' in child.keys()):
                            if(child['Gender'].lower()=='male'):
                                boy_count=boy_count+1
                            else:
                                if(child['Gender'].lower()=='female'):
                                    girl_count+=1


                                    
                                    
                                

                        else:
                            child_date_info_missing_count+=1
                else:
                    children_missing_count+=1
               
                
            else:
                data_form_missing_count+=1

        print "Total number of eligible kids"+str(eligible_kids_count)
        print "Data form missing"+str(data_form_missing_count)
        print "Children information missing"+str(children_missing_count)
        print "Ineligible children Count"+str(inelgibile_children_count)
        print "Child date info missing"+str(child_date_info_missing_count)
        print "The total number of boys are "+str(boy_count)
        print "The total number of girls are "+str(girl_count)
        print "Total Children"+str(total_children)








