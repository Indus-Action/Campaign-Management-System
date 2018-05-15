from __future__ import unicode_literals

from django.db import models
from assessments.models import Assessment

# Create your models here.

class Question(models.Model):


	question_text=models.CharField(max_length=20, blank=False, default='')
	maximum_marks=models.CharField(max_length=255, blank=False, default='')
	assessment=models.ForeignKey(Assessment, related_name='question_assessment', on_delete=models.CASCADE)