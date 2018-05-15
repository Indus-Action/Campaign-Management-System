from rest_framework import serializers
from assessmentreports.models import AssessmentItem



class AssessmentItemSerializer(serializers.ModelSerializer):
    
	

	class Meta:
		model=AssessmentItem
		fields=('assessment','question','child','worker','marks','id')
		

    