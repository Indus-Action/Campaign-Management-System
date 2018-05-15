from rest_framework import serializers
from payments.models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    

    class Meta:
        model = Payment
        fields = ('amount', 'child', 'worker','kit','date')