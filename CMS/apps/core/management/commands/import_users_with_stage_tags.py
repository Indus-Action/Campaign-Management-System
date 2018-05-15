# -*- coding: utf-8 -*-

from django.core.management.base import BaseCommand, CommandError

from tags.models import Tag
from stages.models import Stage
from user_profiles.models import UserProfile
from django.contrib.auth.models import User
from vms2.settings.base import BASE_DIR

import json
import csv


class Command(BaseCommand):
    help = 'Does some magical work'

    def handle(self, *args, **options):
        stages = ['Admitted', 'Documentation', 'Ineligible', 'Identification']
        skip_tags = []
        m_tags = {}

        with open(BASE_DIR + '/data/tags_skip.csv') as f:
            rows = csv.reader(f)

            for row in rows:
                if row[0] not in skip_tags:
                    skip_tags.append(row[0])

            print skip_tags

        with open(BASE_DIR + '/data/chhabra_12Nov_cleaned.csv') as f:
            rows = csv.reader(f, skipinitialspace=True, quotechar="'")

            for row in rows:
                mobile = row[0]
                stage = row[1]
                tags = json.loads(row[3])
                user = None
                user_profile = None
                user_created = False

                if len(mobile) == 11:
                    mobile = mobile[1:]

                user_profile, user_created = UserProfile.objects.get_or_create(mobile=mobile)

                if user_profile:
                    try:
                        if user_created:
                            user = User.objects.create(username=mobile)
                            user.profile = user_profile
                            user.save()
                        else:
                            user = user_profile.user
                    except:
                        continue

                print user
                print user_profile

                try:
                    user_stage = Stage.objects.get(name=stage)
                    user_profile.stage = user_stage
                    user_profile.save()
                    print user_profile.stage
                except:
                    pass

                for tag in tags:
                    if tag.strip() not in skip_tags:
                        try:
                            t = Tag.objects.get(tag=tag.strip())

                            if user:
                                t.users.add(user)
                        except:
                            continue
                            
                if user:
                    print user.tags.all()
