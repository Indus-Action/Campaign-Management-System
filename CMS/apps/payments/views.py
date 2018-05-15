from payments.models import Payment
from payments.serializers import PaymentSerializer
from rest_framework import viewsets,generics
from datetime import date
from dateutil import parser
# Create your views here.


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer



class PaymentWorkerListViewSet(generics.ListAPIView):

	serializer_class=PaymentSerializer

	def get_queryset(self):

		worker_mobile_number=self.kwargs['worker']
		date_of_transaction=self.request.query_params.get('date', None)

		if date_of_transaction is None:

			return Payment.objects.filter(worker__mobile=worker_mobile_number)
		else:

			date_of_transaction=parser.parse(date_of_transaction)
			return Payment.objects.filter(worker__mobile=worker_mobile_number).filter(date=date_of_transaction)

class PaymentDateListViewSet(generics.ListAPIView):

	serializer_class=PaymentSerializer

	def get_queryset(self):

		date_of_transaction=parser.parse(self.kwargs['date'])


		return Payment.objects.filter(date=date_of_transaction)

