from rest_framework import serializers
from centers.models import Center
class CenterSerializer(serializers.ModelSerializer):
    


    class Meta:
        model = Center
        fields = ('id', 'name', 'description', 'location')