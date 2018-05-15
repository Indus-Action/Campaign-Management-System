from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Assessment(models.Model):


	assessment_name=models.CharField(max_length=20, blank=False, default='')
	assessment_description=models.CharField(max_length=255, blank=False, default='')
	