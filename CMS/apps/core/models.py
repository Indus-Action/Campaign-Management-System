from django.db import models


class TimeStampedModel(models.Model):
    """
    An abstract base class model that provides self-updated ``created_at``
    and ``updated_at`` fields
    """

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
