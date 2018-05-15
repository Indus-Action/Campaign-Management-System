from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandError
from user_profiles.models import UserProfile
from forms.models import PersistentFormData
from stages.models import Stage
from tags.models  import Tag
from datetime import date,datetime
from dateutil.parser import parse
from tasks.models import Task
import csv, codecs, cStringIO
import pytz

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
        print "Beginning to extract the information"

        user_data=[]
        count=1

        begin_year=datetime(2017,01,01)
        begin_year.replace(tzinfo=pytz.UTC)
        users=User.objects.filter(tags__in=[Tag.objects.get(tag='Community Champion')])
        count=1

        print "Total number of community champions are "+str(users.count())

        for user in users:
            user_dict={}
            user_joining_date=user.date_joined

            if(user_joining_date.year==2017):
                tasks=Task.objects.filter(beneficiary=user)



               
                count+=1
                user_profile=UserProfile.objects.filter(user=user)
                print str(user_profile[0].points)
                user_persistent_form_data=PersistentFormData.objects.filter(beneficiary=user)
                print user_persistent_form_data[0].data.keys()

                user_dict['mobile']=user_profile[0].mobile
               
                if ("Father Details" in user_persistent_form_data[0].data.keys() and "Name" in user_persistent_form_data[0].data["Father Details"].keys()):

                    user_dict['Father\'s Name']=user_persistent_form_data[0].data["Father Details"]["Name"]
                else:
                    user_dict['Father\'s Name']=""

                if ("Mother Details" in user_persistent_form_data[0].data.keys() and "Name" in user_persistent_form_data[0].data["Mother Details"].keys()):
                    user_dict["Mother\'s Name"]=user_persistent_form_data[0].data["Mother Details"]["Name"]
                else:
                    user_dict["Mother\'s Name"]=""

                for task in tasks:
                    user_dict['rating']=task.assignee_rating
                    break
                user_data.append(user_dict)


        keys=user_data[0].keys()

        with open('/home/ubuntu/vms2/user_champion_data.csv', 'w+') as f:
            dict_writer = DictUnicodeWriter(f, keys, extrasaction='ignore')
            dict_writer.writeheader()
            #try:
            dict_writer.writerows(user_data)



