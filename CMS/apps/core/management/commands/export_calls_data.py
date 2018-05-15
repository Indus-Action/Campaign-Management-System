# -*- coding: utf-8 -*-

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandError

from stages.models import Stage
from tasks.models import Task
from task_status.models import TaskStatus
from task_types.models import TaskType
from forms.models import FormData,PersistentFormData
from guilds.models import Guild
from stages.models import Stage
from tags.models  import Tag
from user_profiles.models import UserProfile
from locations.models import Location
from forms.models import FormData
from calls.models import Call
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
    help = 'Does some magical work'

    def handle(self, *args, **options):
        exported_data = []
        
        user_stage='Admitted'
        count=0
        profiles=UserProfile.objects.filter(user_type='BN').filter(stage__name='Applied')
        print "The Total number of users are "+str(profiles.count())
        task_types=TaskType.objects.all()


        print "The total numbers of users  are "+str(profiles.count())

        data={}
        for profile in profiles:
            count+=1

            data={}
            data['mobile']=profile.mobile

            if(profile.stage is not None):

                data['stage']=profile.stage.name
            else:
                data['stage']="unknown"

            data['Father\'s Name']='Info Not available/No child'
            data['Mother\'s Name']='Info Not available/No child'
            data['Identification stage calls']=''
            data['Documentation stage calls']=''
            data['Application stage calls']=''
            data['Applied stage calls']=''
            data['Admitted stage calls']=''
            data['Going to School stage calls']=''
            data['MSS Feedback stage calls']=''
            data['Centre Feedback stage calls']=''
            data['Helpline Feedback stage calls']=''
            data['Lottery Success stage calls']=''
            data['subloc_1']='Info not avaolable'
            data['subloc_2']='Info not avaolable'
            data['subloc_3']='Info not avaolable'
            data['loc']='Info not avaolable'
            data['admin_area_level_1']='Info not avaolable'
            data['admin_area_level_2']='Info not avaolable'
            data['description']='Info not avaolable'
            data['Category']='Info not available'

            data['Child1 Name']='Info Not available/No child'
            data['Child1 Gender']='Info Not available/No child'
            data['Child2 Name']='Info Not available/No child'
            data['Child2 Gender']='Info Not available/No child'
            data['Child3 Name']='Info Not available/No child'
            data['Child3 Gender']='Info Not available/No child'
            data['Child4 Name']='Info Not available/No child'
            data['Child4 Gender']='Info Not available/No child'
            data['Total Children']='0'
            data['Missed Calls']=profile.number_of_missed_calls

            tags=Tag.objects.all()
            for tag in tags:
                data[tag.tag]='Not Applicable'
            user=profile.user

            if user is None:
                continue

            user_tags=user.tags.all()
            for user_tag in user_tags:
                data[user_tag.tag]=user_tag.tag

            for task_type in task_types:
                data[task_type.task_type+' stage calls']=str(Call.objects.filter(beneficiary=user).filter(task__task_type=task_type).count())

            
            
            try:
                persistent_form_data=PersistentFormData.objects.get(beneficiary=user)

            except:
                persistent_form_data=None
            if (persistent_form_data is not None):

                persistent_data=persistent_form_data.data

                if 'Children' in persistent_data.keys():
                    
                    child_obj=persistent_data['Children']

                    total_children=0
                    for child in child_obj:
                        total_children+=1

                        if('Gender' in child.keys()):

                            data['Child'+str(total_children)+' Gender']=child['Gender']

                        if('Name' in child.keys()):

                            data['Child'+str(total_children)+' Name']=child['Name']
                    data['Total Children']=str(total_children)

                if 'Father Details' in persistent_data.keys():

                    data['Father\'s Name']=persistent_data['Father Details']['Name']

                if 'Mother Details' in persistent_data.keys():

                    data['Mother\'s Name']=persistent_data['Mother Details']['Name']
                if 'Category' in persistent_data.keys():
                    data['Category']=persistent_data['Category']

                if ('Address' in persistent_data.keys()):
                    address_loc=persistent_data['Address']

                    user_location=Location.objects.get(id=address_loc)

            #starting parsting from sublocality level 1

                    if (user_location is not None and user_location.sublocality_level_1 is not None and user_location.sublocality_level_1!=''):

                #constituency=resolve_constituency(user_location.sublocality_level_1,constituency_arr)
                
                #if constituency is not None:

                #data['constituency']=constituency
                #data['constituency_found']='true'
                #data['constituency_method']='sublocality_level_1'
                #constituency_found=True
                        data['subloc_1']=user_location.sublocality_level_1

                    if (user_location.sublocality_level_2 is not None and user_location.sublocality_level_2!=''):

                #constituency=resolve_constituency(user_location.sublocality_level_1,constituency_arr)
                
                #if constituency is not None:

                #data['constituency']=constituency
                #data['constituency_found']='true'
                #data['constituency_method']='sublocality_level_1'
                #constituency_found=True
                        data['subloc_2']=user_location.sublocality_level_2

                    if (user_location.sublocality_level_3 is not None and user_location.sublocality_level_3!=''):

                #constituency=resolve_constituency(user_location.sublocality_level_1,constituency_arr)
                
                #if constituency is not None:

                #data['constituency']=constituency
                #data['constituency_found']='true'
                #data['constituency_method']='sublocality_level_1'
                #constituency_found=True
                        data['subloc_3']=user_location.sublocality_level_3

                    if (user_location.locality is not None and user_location.locality!=''):

                #constituency=resolve_constituency(user_location.sublocality_level_1,constituency_arr)
                
                #if constituency is not None:

                #data['constituency']=constituency
                #data['constituency_found']='true'
                #data['constituency_method']='sublocality_level_1'
                #constituency_found=True
                        data['loc']=user_location.locality


                    if (user_location.administrative_area_level_1 is not None and user_location.administrative_area_level_1!=''):

                #constituency=resolve_constituency(user_location.sublocality_level_1,constituency_arr)
                
                #if constituency is not None:

                #data['constituency']=constituency
                #data['constituency_found']='true'
                #data['constituency_method']='sublocality_level_1'
                #constituency_found=True
                        data['admin_area_level_1']=user_location.administrative_area_level_1 

                    if (user_location.administrative_area_level_2 is not None and user_location.administrative_area_level_2!=''):

                #constituency=resolve_constituency(user_location.sublocality_level_1,constituency_arr)
                
                #if constituency is not None:

                #data['constituency']=constituency
                #data['constituency_found']='true'
                #data['constituency_method']='sublocality_level_1'
                #constituency_found=True
                        data['admin_area_level_2']=user_location.administrative_area_level_2
                    if (user_location.description is not None and user_location.description!=''):

                #constituency=resolve_constituency(user_location.sublocality_level_1,constituency_arr)
                
                #if constituency is not None:

                #data['constituency']=constituency
                #data['constituency_found']='true'
                #data['constituency_method']='sublocality_level_1'
                #constituency_found=True
                        data['description']=user_location.description
                      
            exported_data.append(data)
        
        keys = exported_data[0].keys()
        print keys   
        with open('/home/ubuntu/vms2/data/complete_data_documentation.csv', 'w+') as f:
            dict_writer = DictUnicodeWriter(f, keys, extrasaction='ignore')
            dict_writer.writeheader()
            #try:
            dict_writer.writerows(exported_data)
            #except:
                #print exported_data

