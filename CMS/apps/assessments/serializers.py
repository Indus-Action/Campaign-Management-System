from rest_framework import serializers
from assessments.models import Assessment
from questions.models import Question


class AssessmentSerializer(serializers.ModelSerializer):
    
	question_assessment=serializers.PrimaryKeyRelatedField(many=True,queryset=Question.objects.all())

	class Meta:
		model=Assessment
		fields=('assessment_name','id','assessment_description','id','question_assessment')
		read_only_fields=('question_assessment',)

    