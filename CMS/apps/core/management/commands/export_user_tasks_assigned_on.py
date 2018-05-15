# -*- coding: utf-8 -*-

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandError

from stages.models import Stage
from tasks.models import Task
from task_status.models import TaskStatus
from task_types.models import TaskType
from forms.models import FormData
from guilds.models import Guild
from tags.models import Tag

import csv
import pdb

class Command(BaseCommand):
    help = 'Does some magical work'

    def handle(self, *args, **options):
        #ts = Task.objects.filter(updated_at__range=['2017-01-12', '2017-1-13'])
	ts = Task.objects.all()        

        exported_data = []

        for t in ts:
	    #print len(exported_data)
            new_record = {}
	    if t.beneficiary:
                new_record['beneficiary_username'] = t.beneficiary.username
	        if t.beneficiary.profile:
	    	    new_record['beneficiary_mobile'] = t.beneficiary.profile.mobile
	    	    if t.beneficiary.profile.stage:
	    	        new_record['beneficiary_stage'] = t.beneficiary.profile.stage.name
		    else:
			new_record['beneficiary_stage'] = ""
		else:
		    new_record['beneficiary_mobile'] = ""
		    new_record['beneficiary_stage'] = ""
	    else:
		new_record['beneficiary_username'] = ""
	        new_record['beneficiary_mobile'] = ""
		new_record['beneficiary_stage'] = ""
	
	    if t.assignee:
	        if t.assignee.profile:
            	    new_record['assignee'] = t.assignee.profile.mobile
		    if t.assignee.profile.guild:
	                new_record['guild'] = t.assignee.profile.guild.name
		    else:
			new_record['guild'] = ""
		else:
		    new_record['assignee'] = ""
		    new_record['guild'] = ""
            	new_record['assignee_first_name'] = t.assignee.first_name
            	new_record['assignee_last_name'] = t.assignee.last_name
            exported_data.append(new_record)

        if len(exported_data) > 0:
            keys = exported_data[0].keys()

            with open('call_status_all.csv', 'wb') as f:
                dict_writer = csv.DictWriter(f, keys)
                dict_writer.writeheader()
                dict_writer.writerows(exported_data)

