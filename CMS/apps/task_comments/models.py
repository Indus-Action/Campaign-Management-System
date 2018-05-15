from django.db import models

from core.models import TimeStampedModel

from django.contrib.auth.models import User

from tasks.models import Task


class TaskComment(TimeStampedModel):
    comment = models.TextField()
    commentor = models.ForeignKey(User, related_name='comments')
    task = models.ForeignKey(Task, related_name='comments')

    def __unicode__(self):
        return self.comment
