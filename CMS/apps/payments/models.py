from __future__ import unicode_literals

from django.db import models
from child.models import Child
from worker.models import Worker
from kits.models import IAKit

# Create your models here.
class Payment(models.Model):

	amount=models.CharField(max_length=20, blank=False, default='')
	child=models.ForeignKey(Child, related_name='payment_child', on_delete=models.CASCADE)
	worker=models.ForeignKey(Worker, related_name='payment_worker', on_delete=models.CASCADE)
	kit=models.ForeignKey(IAKit, related_name='payment_kit', on_delete=models.CASCADE)
	date=models.DateField(blank=False)