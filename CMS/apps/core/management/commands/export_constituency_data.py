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
import pdb
from random import *

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

        profiles=UserProfile.objects.all()
        cons=[]


        print "The total numbers of users are "+str(profiles.count())

        with open('cons.csv', 'rb') as f:
            reader=csv.reader(f,delimiter=',')
            for row in reader:
                cons.append(row[0])

        print "The total number of constituencies are "+str(len(cons))



        for profile in profiles:

            if (len(exported_data) == 10000):

                keys = exported_data[0].keys()


                with open('/home/ubuntu/vms2/constituency_data_' + str(randint(1, 10000)) + '.csv', 'w+') as f:
                    dict_writer = DictUnicodeWriter(f, keys, extrasaction='ignore')

                    dict_writer.writeheader()
                    # try:
                    dict_writer.writerows(exported_data)
                exported_data = []
                print "Data written"


            data={}
            data['mobile']=profile.mobile


            if(profile.stage is not None):

                data['stage']=profile.stage.name
            else:
                data['stage']="unknown"

            data['id']=profile.id
            data['constituency']=''
            data['constituency_found']='false'
            data['constituency_method']=''

            constituency_found=False
            
            constituency_method=''

            beneficiary=profile.user
            
            persistent_form_data=None

            try:
                persistent_form_data=PersistentFormData.objects.get(beneficiary=beneficiary)

            except:
                persistent_form_data=None
            if (persistent_form_data is not None):

                persistent_data=persistent_form_data.data

                if ('Address' in persistent_data.keys()):
                    address_loc=persistent_data['Address']

                    user_location=Location.objects.get(id=address_loc)

            

                    if (user_location.sublocality_level_1 is not None and user_location.sublocality_level_1!='' and not constituency_found):

                        constituency=resolve_constituency(user_location.sublocality_level_1,cons)
                
                        if constituency is not None:

                            data['constituency']=constituency
                            data['constituency_found']='true'
                            data['constituency_method']='sublocality_level_1'
                            constituency_found=True
                        
                        
                    if (user_location.sublocality_level_2 is not None and user_location.sublocality_level_2!='' and not constituency_found):

                        constituency=resolve_constituency(user_location.sublocality_level_2,cons)
                
                        if constituency is not None:

                            data['constituency']=constituency
                            data['constituency_found']='true'
                            data['constituency_method']='sublocality_level_2'
                            constituency_found=True
                        
                            
                        

                    if (user_location.sublocality_level_3 is not None and user_location.sublocality_level_3!=''and not constituency_found):

                        constituency=resolve_constituency(user_location.sublocality_level_3,cons)
                
                        if constituency is not None:

                            data['constituency']=constituency
                            data['constituency_found']='true'
                            data['constituency_method']='sublocality_level_3'
                            constituency_found=True

                    if (user_location.description is not None and user_location.description!=''and not constituency_found):

                        constituency=resolve_constituency(user_location.description,cons)
                
                        if constituency is not None:

                            data['constituency']=constituency
                            data['constituency_found']='true'
                            data['constituency_method']='description'
                            constituency_found=True
                        
                            
                        


            exported_data.append(data)

        keys = exported_data[0].keys()
        
        with open('/home/ubuntu/vms2/location.csv', 'w+') as f:
            dict_writer = DictUnicodeWriter(f, keys, extrasaction='ignore')
            dict_writer.writeheader()
            #try:
            dict_writer.writerows(exported_data)
            #except:
                #print exported_data

def resolve_constituency(address,constituency_arr):

    for constituency in constituency_arr:
        
        if address.lower() in constituency.lower():
            return constituency
        if constituency.lower() in address.lower():
            return constituency
    return None