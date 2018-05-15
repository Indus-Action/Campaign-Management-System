from __future__ import unicode_literals

from django.db import models

from core.models import TimeStampedModel

class TrainingKit(TimeStampedModel):
    name = models.CharField(max_length=20, unique=True)
    description = models.CharField(max_length=100, default='Description')

    def __unicode__(self):
        return self.name

class Page(TimeStampedModel):
    CONTENT_TYPE_LIST = (
            ('TXT', 'Text'),
            ('IMG', 'Image'),
            ('VID', 'Video'),
            ('HTM', 'HTML'),
        )
    name = models.CharField(max_length=20, default='New Page')
    description = models.CharField(max_length=100, default='Description')
    content = models.TextField(default='')
    content_type = models.CharField(
            max_length = 3,
            choices = CONTENT_TYPE_LIST,
            default='TXT'
        )
    kit = models.ForeignKey(
            TrainingKit,
            related_name='pages',
            on_delete=models.CASCADE
        )

    def __unicode__(self):
        return '%s : %s' % (self.name, self.kit)
