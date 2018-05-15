from rest_framework import viewsets, generics
from rest_framework.response import Response

from calls.models import Call
from calls.serializers import CallSerializer


class CallViewSet(viewsets.ModelViewSet):
    queryset = Call.objects.all()
    serializer_class = CallSerializer

    def perform_create(self, serializer):
        instance = serializer.save(caller=self.request.user)

        return super(CallViewSet, self).perform_create(serializer)


class BeneficiaryCallsView(generics.ListAPIView):
    queryset = Call.objects.all()
    serializer_class = CallSerializer

    def get(self, request, beneficiary_pk=None):
        queryset = self.queryset.filter(beneficiary__pk=beneficiary_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


class CallerCallsView(generics.ListAPIView):
    queryset = Call.objects.all()
    serializer_class = CallSerializer

    def get(self, request, caller_pk=None):
        queryset = self.queryset.filter(caller__pk=caller_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)
