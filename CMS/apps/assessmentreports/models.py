from __future__ import unicode_literals
from assessments.models import Assessment
from questions.models import Question
from worker.models import Worker
from child.models import Child

from django.db import models

# Create your models here.

class AssessmentItem(models.Model):


	assessment=models.ForeignKey(Assessment, related_name='question_assessment_item', on_delete=models.CASCADE)
	question=models.ForeignKey(Question, related_name='question_item', on_delete=models.CASCADE)
	child=models.ForeignKey(Child,related_name='question_child_item', on_delete=models.CASCADE)
	worker=models.ForeignKey(Worker,related_name='question_worker_item', on_delete=models.CASCADE)
	marks=models.CharField(max_length=255, blank=False, default='')
	