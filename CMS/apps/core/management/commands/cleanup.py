# -*- coding: utf-8 -*-

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandError
from django.db.models import Q

from stages.models import Stage
from tasks.models import Task
from task_status.models import TaskStatus
from task_types.models import TaskType
from forms.models import FormData
from guilds.models import Guild
from tags.models import Tag
from task_status_categories.models import TaskStatusCategory
from user_profiles.models import UserProfile

import csv
import pdb
from datetime import datetime

class Command(BaseCommand):
    help = 'Does some magical work'

    def handle(self, *args, **options):
        ie_tags = ["Age > 6", "Abusive", "Age < 3", "Income > 1 Lac", "No Child", 
                   "Wrong Number", "Not Interested", "NGO", "Cyber Cafe", 
                   "Other State", "Helpline", "Volunteer"]
        
        tag_objs = []
        for t in ie_tags:
            tag = Tag.objects.get(tag=t)
            tag_objs.append(tag)
        
        stage = Stage.objects.get(name="Identification")
        ds = Stage.objects.get(name="Ineligible")

        users = stage.users.all()
        count = 0

        user_bulk = []

        user_profiles = UserProfile.objects.filter(user__tags__in=tag_objs)
        print user_profiles.count()

        
