# -*- coding: utf-8 -*-

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User

from tasks.models import Task
from task_status.models import TaskStatus
from exotel.models import Exotel
from calls.models import Call

from vms2.settings.base import get_env_variable

import requests
from datetime import datetime, timedelta


class Command(BaseCommand):
    help = 'Does some magical work'

    def handle(self, *args, **options):
        exotel, created = Exotel.objects.get_or_create()

        task_type = exotel.default_task_type
        task_status = TaskStatus.objects.get(status='Call Success')

        exotel_app_id = 121180

        users = User.objects.filter(profile__user_type='HL')
        mobiles = []

        today = datetime.today()

        for user in users:
            calls = user.caller_calls.filter(task__status=task_status, end=True, beneficiary__isnull=False, start_time__gt=(today - timedelta(1)))[:30]

            for call in calls:
                print call.beneficiary
                mobiles.append(call.beneficiary.profile.mobile)

        sid = get_env_variable('EXOTEL_SID')
        token = get_env_variable('EXOTEL_TOKEN')
        exophone = get_env_variable('EXOTEL_EXOPHONE')

        for mobile in mobiles:
            print mobile
            requests.post('https://twilix.exotel.in/v1/Accounts/{sid}/Calls/connect.json'.format(sid=sid),
                          auth=(sid, token),
                          data={
                              'From': mobile,
                              'To': exophone,
                              'CallerId': exophone,
                              'Url': 'http://my.exotel.in/exoml/start/' + str(exotel_app_id),
                              'CallType': 'trans'
                          })
