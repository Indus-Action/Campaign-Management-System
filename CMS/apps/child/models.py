from __future__ import unicode_literals

from django.db import models
from parents.models import Parent

# Create your models here.
class Child(models.Model):

	first_name=models.CharField(max_length=20, blank=False, default='')
	last_name=models.CharField(max_length=20, blank=False, default='')
	dob=models.DateField(auto_now=False, blank=False)
	parent=models.ForeignKey(Parent, related_name='child_parent', on_delete=models.CASCADE)
	