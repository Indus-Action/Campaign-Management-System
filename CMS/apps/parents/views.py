from parents.models import Parent
from parents.serializers import ParentSerializer
from rest_framework import viewsets,generics
# Create your views here.


class ParentViewSet(viewsets.ModelViewSet):
    queryset = Parent.objects.all()
    serializer_class = ParentSerializer


class ParentWorkerListViewSet(generics.ListAPIView):

	serializer_class=ParentSerializer

	def get_queryset(self):

		worker_mobile_number=self.kwargs['worker']
		return Parent.objects.filter(worker__mobile=worker_mobile_number)
