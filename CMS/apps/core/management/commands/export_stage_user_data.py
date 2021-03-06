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

        #tasks = Task.objects.filter(task_type__task_type='Retention Survey').filter(status__status='Call Done').exclude(beneficiary__tags__in=[Tag.objects.get(tag='Data Export Progress')])[:1500]
        profiles=UserProfile.objects.filter(stage__name='Lottery Success')
        print str(profiles.count())
        count=0


        for profile in profiles:
            print str(count)
            if count==10000:
                break

                
            data = {}
            data['Mobile'] = profile.mobile

            
            try:
                if profile.user.persistent_data is not None and profile.user.persistent_data.data is not None:
                    count+=1

                    pdata = profile.user.persistent_data.data
                    for key, value in pdata.iteritems():
                        if isinstance(value, dict):
                            tdict1 = {}
                            for key1, value1 in value.iteritems():
                                if isinstance(value1, dict):
                                    tdict2 = {}
                                    for key2, value2 in value1.iteritems():
                                        tdict2[key + ' -> ' + key1 + ' -> ' + key2] = unicode(value2)
                                    data.update(tdict2)
                                else:
                                    tdict1[key + '->' + key1] = unicode(value1)
                            data.update(tdict1)
                        else:
                            data.update({key:unicode(value)})

            
                exported_data.append(data)
            except:
                print ""
        keys=exported_data[0].keys()

        

        print count
        with open('ls_stage_data.csv', 'wb') as f:
            dict_writer = DictUnicodeWriter(f, keys, extrasaction='ignore')
            dict_writer.writeheader()
            #try:
            dict_writer.writerows(exported_data)
            #except:
                #print exported_data
