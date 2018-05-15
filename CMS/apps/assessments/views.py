from assessments.models import Assessment
from assessments.serializers import AssessmentSerializer
from rest_framework import viewsets
# Create your views here.


class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer

