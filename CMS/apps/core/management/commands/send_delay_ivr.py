# -*- coding: utf-8 -*-

from django.core.management.base import BaseCommand, CommandError

from tasks.models import Task
from exotel.models import Exotel

from vms2.settings.base import get_env_variable

import requests
from datetime import datetime, timedelta


class Command(BaseCommand):
    help = 'Does some magical work'

    def handle(self, *args, **options):
        exotel, created = Exotel.objects.get_or_create()

        task_type = exotel.default_task_type
        task_status = exotel.default_task_status

        exotel_app_id = 121120

        tasks = Task.objects.filter(task_type=task_type, status=task_status, due_date__lt=(datetime.today().date() - timedelta(1)))

        sid = get_env_variable('EXOTEL_SID')
        token = get_env_variable('EXOTEL_TOKEN')
        exophone = get_env_variable('EXOTEL_EXOPHONE')

        for task in tasks:
            requests.post('https://twilix.exotel.in/v1/Accounts/{sid}/Calls/connect.json'.format(sid=sid),
                          auth=(sid, token),
                          data={
                              'From': task.beneficiary.profile.mobile,
                              'To': exophone,
                              'CallerId': exophone,
                              'Url': 'http://my.exotel.in/exoml/start/' + str(exotel_app_id),
                              'CallType': 'trans'
                          })
