from __future__ import unicode_literals

from django.db import models

# Create your models here.

class IAKit(models.Model):

	name=models.CharField(max_length=20, blank=False, default='')
	description=models.CharField(max_length=100, blank=False, default='')
	price=models.CharField(max_length=5, blank=False, default='')