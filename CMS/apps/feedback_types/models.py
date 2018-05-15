from django.db import models

from core.models import TimeStampedModel


class FeedbackType(TimeStampedModel):
    feedback_type = models.CharField(max_length=20,
                                     unique=True)
    desc = models.TextField(blank=True)

    def __unicode__(self):
        return self.feedback_type
