from rest_framework import serializers
from parents.models import Parent
from child.models import Child

class ParentSerializer(serializers.ModelSerializer):

	
	child_parent=serializers.PrimaryKeyRelatedField(many=True,queryset=Child.objects.all())

	class Meta:
		model=Parent

		fields=('first_name', 'last_name', 'mobile', 'location','worker','child_parent')
		read_only_fields=('child_parent',)
