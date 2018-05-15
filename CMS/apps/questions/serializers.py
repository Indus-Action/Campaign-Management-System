from rest_framework import serializers
from questions.models import Question


class QuestionSerializer(serializers.ModelSerializer):
    


    class Meta:
        model = Question
        fields = ('question_text', 'maximum_marks', 'id','assessment')