from django.contrib.auth.models import User

from django.db import models
from django.db.models import Q
from django.db.models.signals import post_save
from django.dispatch import receiver

from core.models import TimeStampedModel
from stages.models import Stage
from message_templates.models import MessageTemplate
from task_types.models import TaskType
from task_status.models import TaskStatus
from user_messages.models import Message
from tasks.models import Task
from task_status_categories.models import TaskStatusCategory
from exotel.models import Exotel
from ivr_templates.models import IVRTemplate
from ivrs.models import IVR

import random


class Action(TimeStampedModel):
    name = models.CharField(max_length=4, unique=True)
    desc = models.TextField(max_length=100)

    def fire(self, **kwargs):
        self.__class__.get_action_class(self.name).fire(**kwargs)

    @staticmethod
    def get_action_class(action_type):
        action_class = None

        if action_type == 'SM':
            action_class = SendMessageAction
        elif action_type == 'CT':
            action_class = CreateTaskAction
        elif action_type == 'SI':
            action_class = SendIVRAction
        elif action_type == 'AT':
            action_class = AddTagAction
        elif action_type == 'CS':
            action_class = ChangeStageAction
        elif action_type == 'AU':
            action_class = ArchiveUserAction

        return action_class


class SendMessageAction(Action):
    name = 'SM'
    desc = 'Send Message'

    @staticmethod
    def fire(user, task, params, **kwargs):
        if 'message_template' in params.keys():
            template = MessageTemplate.objects.get(pk=params['message_template']['id'])
            sender = None
            beneficiary = None

            if task:
                beneficiary = task.beneficiary

            if user:
                beneficiary = user

            if 'authenticated_user' in params.keys():
                sender = User.objects.get(pk=params['authenticated_user']['id'])

            if template and beneficiary:
                Message.objects.create(beneficiary=beneficiary, sender=sender, template=template)


class CreateTaskAction(Action):
    name = 'CT'
    desc = 'Create Task'

    @staticmethod
    def fire(user, task, params, **kwargs):
        if 'task_type' in params.keys():
            task_type = TaskType.objects.get(pk=params['task_type']['id'])
            assignee = None
            task_status = None
            beneficiary = None
            creator = None

            if 'task_status' in params.keys():
                task_status = TaskStatus.objects.get(pk=params['task_status']['id'])
            else:
                task_status = task_type.default_task_status

            if 'assignee' in params.keys():
                assignee = User.objects.get(pk=params['assignee']['id'])

            if 'assignee_user_type' in params.keys():
                users = User.objects.filter(profile__user_type=params['assignee_user_type'])
                assignee = random.choice(list(users))

            if task:
                beneficiary = task.beneficiary
            elif user:
                beneficiary = user

            already_existing_tasks = Task.objects.filter(Q(task_type=task_type) &
                                                        ~Q(status__category__task_completed_flag='DONE') &
                                                        Q(beneficiary=user))

            if 'authenticated_user' in params.keys():
                creator = User.objects.get(pk=params['authenticated_user']['id'])

            if len(already_existing_tasks) == 0:
                Task.objects.create(status=task_status, task_type=task_type, assignee=assignee,
                                beneficiary=beneficiary, creator=creator)
            else:
                exotel, created = Exotel.objects.get_or_create()
                task_status = exotel.default_task_status

                for task in already_existing_tasks:
                    if task.status.category.task_completed_flag == 'TODO':
                        if assignee:
                            task.assignee = assignee
                        task.status = task_status
                        task.save()



class SendIVRAction(Action):
    name = 'SI'
    desc = 'Send IVR'

    @staticmethod
    def fire(user, task, params, **kwargs):
        if 'ivr_template' in params.keys():
            template = IVRTemplate.objects.get(pk=params['ivr_template']['id'])
            sender = None
            beneficiary = None

            if task:
                beneficiary = task.beneficiary

            if user:
                beneficiary = user

            if 'authenticated_user' in params.keys():
                sender = User.objects.get(pk=params['authenticated_user']['id'])

            if template and beneficiary:
                IVR.objects.create(beneficiary=beneficiary, sender=sender, template=template, exotel_app_id=template.exotel_app_id)


class AddTagAction(Action):
    name = 'AT'
    desc = 'Add Tags'

    @staticmethod
    def fire(user, task, params, **kwargs):
        if 'tags' in params.keys():
            for t in params['tags']:
                tag = Tag.objects.get(pk=t)
                user.tags.add(tag)


class ChangeStageAction(Action):
    name = 'CS'
    desc = 'Change Stage'

    @staticmethod
    def fire(user, task, params, **kwargs):
        if 'stage' in params.keys():
            stage = Stage.objects.get(pk=params['stage']['id'])
            if stage != user.profile.stage:
                user.profile.stage = stage
                user.profile.save()


class ArchiveUserAction(Action):
    name = 'AU'
    desc = 'Archive User'

    @staticmethod
    def fire(user, task, params, **kwargs):
        if task and not user:
            user = task.beneficiary

        if not user.profile.archived:
            user.profile.archived = True

            user.profile.save()


@receiver(post_save, sender=Action, dispatch_uid="first_save_action")
def action_post_save_method(instance, sender, **kwargs):
    action_desc = {'SM': 'Send Message', 'CS': 'Change Stage', 'CT': 'Create Task', 'SI': 'Send IVR', 'AT': 'Add Tag', 'AU': 'Archive User'}

    if not instance.desc:
        instance.desc = action_desc[instance.name]

        instance.save()
        post_save.send(sender=sender, instance=instance, dispatch_uid="first_save_action")

post_save.connect(action_post_save_method, sender=Action, dispatch_uid="first_save_action")
