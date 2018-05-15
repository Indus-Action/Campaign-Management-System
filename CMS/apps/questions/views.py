from questions.models import Question
from questions.serializers import QuestionSerializer
from rest_framework import viewsets
# Create your views here.


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

