# -*- coding: utf-8 -*-

from django.core.management.base import BaseCommand, CommandError

from calls.models import Call
from stages.models import Stage
from tasks.models import Task
from task_status.models import TaskStatus
from task_types.models import TaskType
from tags.models import Tag
from forms.models import FormData, PersistentFormData
from guilds.models import Guild
from user_profiles.models import UserProfile
from django.db.models import Q

import csv
from datetime import datetime, timedelta

class Command(BaseCommand):
    help = 'Does some magical work'

    def handle(self, *args, **options):
        ft = TaskType.objects.get(task_type="Dost Father")
        pt = TaskType.objects.get(task_type="Dost Paid")

        ftts = pt.tasks.all()

        data_export = []
        count = 0
        
        for ftt in ftts:
            print ftt.beneficiary
            record = {}
            record["mobile"] = ftt.beneficiary.profile.mobile

            try:
                pfd = PersistentFormData.objects.get(beneficiary=ftt.beneficiary)
            except:
                count += 1
                continue
            calls = Call.objects.filter(task=ftt, end=True)

            record["number_of_calls"] = len(calls)
            duration = 0
            data = ftt.form_data.data
            fd = None
            md = None
            
            for call in calls:
                d = (call.end_time - call.start_time).seconds
                duration += d

            record["duration"] = duration

            children = []
            if "Children" in pfd.data.keys():
                children = pfd.data["Children"]

            if "Father Details" in pfd.data.keys():
                fd = pfd.data["Father Details"]

            if "Mother Details" in pfd.data.keys():
                md = pfd.data["Mother Details"]

            if fd:
                if "Mobile" in fd.keys():
                    record["father_mobile"] = fd["Mobile"]
                else:
                    record["father_mobile"] = ""
                if "Name" in fd.keys():
                    record["father_name"] = fd["Name"]
                else:
                    record["father_name"] = ""
                if "Whatsapp" in fd.keys():
                    record["father_whatsapp"] = fd["Whatsapp"]
                else:
                    record["father_whatsapp"] = ""
            else:
                record["father_mobile"] = ""
                record["father_name"] = ""
                record["father_whatsapp"] = ""

            if md:
                if "Mobile" in md.keys():
                    record["mother_mobile"] = md["Mobile"]
                else:
                    record["mother_mobile"] = ""
                if "Name" in md.keys():
                    record["mother_name"] = md["Name"]
                else:
                    record["mother_name"] = ""
                if "Whatsapp" in md.keys():
                    record["mother_whatsapp"] = md["Whatsapp"]
                else:
                    record["mother_whatsapp"] = ""
            else:
                record["mother_mobile"] = ""
                record["mother_name"] = ""
                record["mother_whatsapp"] = ""

            record["status"] = ftt.status.status
            if u'\u0939\u092e \u0906\u092a\u0915\u094b \u0915\u093f\u0938 \u0938\u092e\u092f \u092b\u094b\u0928 \u0915\u0930 \u0938\u0915\u0924\u0947 \u0939\u0948?' in data.keys():
                record["convenient_time"] = data[u'\u0939\u092e \u0906\u092a\u0915\u094b \u0915\u093f\u0938 \u0938\u092e\u092f \u092b\u094b\u0928 \u0915\u0930 \u0938\u0915\u0924\u0947 \u0939\u0948?'].encode('utf8')

            record["children_names"] = []
            record["children_dobs"] = []
            
            for child in children:
                record["children_names"].append(child["Name"])
                record["children_dobs"].append(child["Date of Birth"])

            data_export.append(record)
            print record

        keys = data_export[0].keys()
        print count

        with open('dost_report_paid.csv', 'wb') as f:
            dict_writer = csv.DictWriter(f, keys)
            dict_writer.writeheader()
            dict_writer.writerows(data_export)

