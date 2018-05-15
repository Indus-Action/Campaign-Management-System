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
from dateutil.parser import parse

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
        user_profile_objects=User.objects.filter(profile__stage__name='Going to School').exclude(tags__in=[Tag.objects.get(tag='Wrong Number')])

        print "The total number of user objects are "+str(user_profile_objects.count())
        
        missing_dob_tag=Tag.objects.get(tag='IA 2017 Missing DOB')
        
        



        eligible_family_count=0
        eligible_kids_count=0
        user_date_of_birth_missing=0

        data_form_missing_count=0
        children_missing_count=0
        ineligiblie_family_count=0
        inelgibile_children_count=0
        child_date_info_missing_count=0
        more_than_one_form=0
        total_children=0

        eligible_family=False
        tag_found=False
        export_data=[]
        for user_obj in user_profile_objects:

            data={}
            
            user_form_data=PersistentFormData.objects.filter(beneficiary=user_obj)
            if(user_form_data.count()!=0 and user_form_data is not None):

                if (user_form_data.count()>1):
                    more_than_one_form+=1
            
                if 'Children' in user_form_data[0].data.keys():
                    
                    child_obj=user_form_data[0].data['Children']

                    inelgibile_child_found=False
                    eligible_child_found=False
                    data_of_birth_missing=False
                    for child in child_obj:

                        

                        total_children+=1
                       
                        if('Date of Birth' in child.keys() and child['Date of Birth'] is not None):    

                            date_time=parse(child['Date of Birth'])
                            
                            if(date_time.year==1970):
                                tag_found=False
                                tags=user_obj.tags.all()
                                if (tags.count()>0):
                                    for tag in tags:
                                        if(tag.tag=='Age < 3' or tag.tag=='Age > 6'):
                                            
                                            inelgibile_children_count+=1

                                            if(not inelgibile_child_found):
                                                inelgibile_child_found=True

                                            tag_found=True
                                            
                                    if not tag_found:
                                        child_date_info_missing_count+=1
                                        data_of_birth_missing=True
                                        
                                        

                                            
                                        
                                else:
                                    child_date_info_missing_count+=1
                                    data_of_birth_missing=True
                                    
                                            
                            else:
                               
                                begin_year=datetime(2012,04,01)
                                end_year=datetime(2015,03,31)
                                end_year=end_year.replace(tzinfo=None)
                                begin_year=begin_year.replace(tzinfo=None)
                                date_time=date_time.replace(tzinfo=None)
                                
                                if date_time<begin_year or date_time>end_year:
                                    inelgibile_children_count+=1

                                    if(not inelgibile_child_found):

                                        inelgibile_child_found=True
                                    
                                else:
                                    eligible_kids_count+=1
                                    eligible_child_found=True
                                    
                                    
                                    
                                

                        else:
                            child_date_info_missing_count+=1
                            data_of_birth_missing=True
                            

                    if(inelgibile_child_found):
                        ineligiblie_family_count+=1

                    if(eligible_child_found):
                        data['mobile']=user_obj.profile.mobile
                        data['Father\'s Name']='Info Not available/No child'
                        data['Mother\'s Name']='Info Not available/No child'
                        if 'Father Details' in user_form_data[0].data.keys():

                            data['Father\'s Name']=user_form_data[0].data['Father Details']['Name']

                        if 'Mother Details' in user_form_data[0].data.keys():

                            data['Mother\'s Name']=user_form_data[0].data['Mother Details']['Name']



                        eligible_family_count+=1
                    if(data_of_birth_missing):
                        user_date_of_birth_missing+=1
                        user_obj.tags.add(missing_dob_tag)

                else:
                    children_missing_count+=1
                    
                    
               
                
            else:
                data_form_missing_count+=1
            if(len(data.keys())!=0):
                export_data.append(data)    
                
        keys = export_data[0].keys()
        print keys
           
        with open('/home/ubuntu/vms2/data/eligible_child_data_going_to_school.csv', 'w+') as f:
            dict_writer = DictUnicodeWriter(f, keys, extrasaction='ignore')
            dict_writer.writeheader()
            #try:
            dict_writer.writerows(export_data)
        print "Total number of eligible kids"+str(eligible_kids_count)
        print "Users with form missing"+str(data_form_missing_count)
        print "Children information missing"+str(children_missing_count)
        print "Ineligible children Count"+str(inelgibile_children_count)
        print "Children with date of birth information missing"+str(child_date_info_missing_count)
      
        print "Total Children"+str(total_children)
        print "Total Ineligible Families "+str(ineligiblie_family_count)
        print "Total Eligible Families" + str(eligible_family_count)
        print "Families with missing date of birth information "+str(user_date_of_birth_missing)







