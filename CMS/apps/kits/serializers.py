from rest_framework import serializers
from kits.models import IAKit
class KitSerializer(serializers.ModelSerializer):
    


    class Meta:
        model = IAKit
        fields = ('id', 'name', 'description', 'price')