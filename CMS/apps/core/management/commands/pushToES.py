# -*- coding: utf-8 -*-

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandError
from django.core.exceptions import ImproperlyConfigured

from stages.models import Stage
from tasks.models import Task
from task_status.models import TaskStatus
from task_types.models import TaskType
from forms.models import FormData
from guilds.models import Guild
from tags.models import Tag
from calls.models import Call
from locations.models import Location

from tasks.serializers import TaskListTaskSerializer
from task_status_categories.serializers import TaskStatusCategorySerializer
from forms.serializers import FormDataSerializer, PersistentFormDataSerializer
from calls.serializers import CallSerializer
from tags.serializers import LightTagSerializer
from guilds.serializers import GuildSerializer
from stages.serializers import StageSerializer
from user_profiles.serializers import UserSerializer
from locations.serializers import LocationSerializer
from notes.serializers import NoteSerializer

import csv
import json
import pdb
import traceback
from elasticsearch import Elasticsearch
from datetime import datetime, timedelta

import os

def get_env_variable(var_name):
    try:
        return os.environ[var_name]
    except KeyError:
        error_msg = "Set the %s environment variable" % var_name
        raise ImproperlyConfigured(error_msg)

class Command(BaseCommand):
    help = 'Does some magical work'

    def handle(self, *args, **options):
        exported_data = []
        username = get_env_variable('ELASTIC_USERNAME')
        password = get_env_variable('ELASTIC_PASSWORD')
        index_name = get_env_variable('INDEX_NAME')

        es = Elasticsearch([{'host': 'localhost', 'post': 9200}], timeout=30, http_auth=(username, password))

        last_updated = datetime.now() - timedelta(365*10)

        with open('/home/ubuntu/vms2/pushToEs_last_updated', 'r') as f:
            rows = csv.reader(f)

            for row in rows:
                last_updated = datetime.strptime(row[0], "%Y-%m-%d %H:%M:%S.%f")

        tasks = Task.objects.filter(updated_at__gt=last_updated).exclude(task_type__task_type='Retention Survey').order_by('updated_at')[:1000]
        # tasks = Task.objects.filter(updated_at__gt=last_updated).order_by('updated_at')[:2500]

        for task in tasks:
            task_doc = dict(TaskListTaskSerializer(task).data)

            task_doc['timestamp'] = datetime.now()
            task_doc['form_data'] = dict(FormDataSerializer(task.form_data).data)
            task_doc['task_status_category'] = dict(TaskStatusCategorySerializer(task.status.category).data)

            if task.beneficiary and hasattr(task.beneficiary, 'profile'):
                task_doc['beneficiary']['date_joined'] = task.beneficiary.date_joined
                task_doc['beneficiary']['profile'] = dict(UserSerializer(task.beneficiary.profile).data)
                task_doc['beneficiary']['notes'] = json.loads(json.dumps(NoteSerializer(task.beneficiary.beneficiary_notes.all(), many=True).data))

            if task.beneficiary and hasattr(task.beneficiary, 'persistent_data'):
                task_doc['beneficiary']['persistent_data'] = dict(PersistentFormDataSerializer(task.beneficiary.persistent_data).data)
                if 'Address' in task_doc['beneficiary']['persistent_data']['data'].keys():
                    try:
                        location = Location.objects.get(pk=task_doc['beneficiary']['persistent_data']['data']['Address'])
                        task_doc['beneficiary']['location'] = dict(LocationSerializer(location).data)
                        task_doc['beneficiary']['location']['geocordinates'] = {}
                        task_doc['beneficiary']['location']['geocordinates']['lat'] = location.lat
                        task_doc['beneficiary']['location']['geocordinates']['lon'] = location.lng
                    except:
                        pass

            calls = Call.objects.filter(task=task)
            task_doc['calls'] = []
            for call in calls:
                call_dict = dict(CallSerializer(call).data)
                if call_dict['end']:
                    call_duration = (call.end_time - call.start_time).seconds
                    call_dict['duration'] = call_duration
                    call_dict['caller'] = dict(UserSerializer(call.caller.profile).data)
                    task_doc['calls'].append(call_dict)

            if task.beneficiary:
                task_doc['beneficiary']['tags'] = []

                tags = task.beneficiary.tags.all()
                for tag in tags:
                    task_doc['beneficiary']['tags'].append(dict(LightTagSerializer(tag).data))

                if hasattr(task.beneficiary.profile, 'stage'):
                    task_doc['beneficiary']['stage'] = dict(StageSerializer(task.beneficiary.profile.stage).data)

            if task.assignee and hasattr(task.assignee, 'profile'):
                task_doc['assignee']['profile'] = dict(UserSerializer(task.assignee.profile).data)

            if task.assignee and hasattr(task.assignee, 'profile') and hasattr(task.assignee.profile, 'guild'):
                task_doc['assignee']['guild'] = dict(GuildSerializer(task.assignee.profile.guild).data)

            # print task_doc
            try:
                res = es.index(index=index_name, doc_type='task', id=task.id, body=task_doc)
            except Exception as e:
                if e.error == 'mapper_parsing_exception':
                    print task_doc
                    task_doc['beneficiary']['persistent_data']['data']['Children'][0]['Date of Birth'] = datetime.strptime(task_doc['beneficiary']['persistent_data']['data']['Children'][0]['Date of Birth'], '%d/%m/%Y')
                    res = es.index(index='ia', doc_type='task', id=task.id, timestamp=task_doc['timestamp'], body=task_doc)
                    # print task_doc
                    continue
                last_updated = task.updated_at
                # print task_doc
                break
            last_updated = task.updated_at

        with open('/home/ubuntu/vms2/pushToEs_last_updated', 'w') as f:
            f.write(last_updated.strftime("%Y-%m-%d %H:%M:%S.%f"))
