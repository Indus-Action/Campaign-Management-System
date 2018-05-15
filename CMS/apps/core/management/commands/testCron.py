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
from calls.models import Call

from tasks.serializers import TaskListTaskSerializer
from task_status_categories.serializers import TaskStatusCategorySerializer
from forms.serializers import FormDataSerializer, PersistentFormDataSerializer
from calls.serializers import CallSerializer
from tags.serializers import LightTagSerializer
from guilds.serializers import GuildSerializer
from stages.serializers import StageSerializer
from user_profiles.serializers import UserSerializer

import csv
import pdb
from elasticsearch import Elasticsearch
from datetime import datetime, timedelta

class Command(BaseCommand):
    help = 'Does some magical work'

    def handle(self, *args, **options):
        es = Elasticsearch([{'host': 'localhost', 'post': 9200}], timeout=30)

        print es
