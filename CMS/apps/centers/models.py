from __future__ import unicode_literals
from django.db import models
from locations.models import Location



# Create your models here.

class Center(models.Model):
	name=models.CharField(max_length=20, blank=False, default='')
	description=models.CharField(max_length=100, blank=False, default='')
	location=models.ForeignKey(Location, related_name='locations', on_delete=models.CASCADE)
