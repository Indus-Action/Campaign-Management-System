from rest_framework import serializers
from child.models import Child


class ChildSerializer(serializers.ModelSerializer):
    


    class Meta:
        model = Child
        fields = ('first_name', 'last_name', 'dob', 'parent','id')