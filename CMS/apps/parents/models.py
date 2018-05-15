from __future__ import unicode_literals

from django.db import models
from locations.models import Location
from worker.models import Worker

# Create your models here.
class Parent(models.Model):

	first_name=models.CharField(max_length=20, blank=False, default='')
	last_name=models.CharField(max_length=20, blank=False, default='')
	mobile=models.CharField(max_length=11, blank=False, primary_key=True)
	location=models.ForeignKey(Location, related_name='parent_locations', on_delete=models.CASCADE)
	worker=models.ForeignKey(Worker, related_name='parent_worker', on_delete=models.CASCADE)
	