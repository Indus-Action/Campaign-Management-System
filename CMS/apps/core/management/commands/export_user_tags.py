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

        retention_survey_users=User.objects.filter(tags__in=[Tag.objects.get(tag='Admitted 2016 IA')])
        print "The total number of retention survey users are "+str(retention_survey_users.count())+"."

        for retention_survey_user in retention_survey_users:

            user_data={}
            user_data['mobile']=retention_survey_user.profile.mobile

            tags=retention_survey_user.tags.all()

            tag_str='#'

            for tag in tags:

                tag_str=tag_str+'#'+str(tag.tag)
            user_data['tags']=tag_str
            exported_data.append(user_data)

        keys = exported_data[0].keys()

        with open('/home/ubuntu/vms2/user_tags.csv', 'wb') as f:
            dict_writer = DictUnicodeWriter(f, keys, extrasaction='ignore')
            dict_writer.writeheader()
            #try:
            dict_writer.writerows(exported_data)
            #except:
                #print exported_data
