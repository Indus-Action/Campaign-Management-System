from django.db import models

from core.models import TimeStampedModel

from django.contrib.auth.models import User


class Todo(TimeStampedModel):
    todo = models.CharField(max_length=100)
    reporter = models.ForeignKey(User, related_name='todos_created')
    assignee = models.ForeignKey(User, related_name='todos_assigned', null=True)
    beneficiary = models.ForeignKey(User, related_name='beneficiary_todos', null=True)
    due_date = models.DateField(null=True)

    done = models.BooleanField(default=False)

    def __unicode__(self):
        return self.todo
