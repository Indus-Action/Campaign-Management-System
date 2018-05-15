from assessmentreports.models import AssessmentItem
from assessmentreports.serializers import AssessmentItemSerializer
from rest_framework import viewsets
# Create your views here.


class AssessmentItemViewSet(viewsets.ModelViewSet):
    queryset = AssessmentItem.objects.all()
    serializer_class = AssessmentItemSerializer

