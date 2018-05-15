from rest_framework import serializers
from dbmodels.models import Address,IAUser,Center


class AddressSerializer(serializers.ModelSerializer):

	
	
	class Meta:
		model=Address
		fields=('id','addressLineOne','addressLineTwo','district','state','pincode','country')
		

class IAUserSerializer(serializers.ModelSerializer):

	class Meta:
		model=IAUser
		fields=('id','firstName','lastName','phoneNumber','email','address','hashValue')


class CenterSerializer(serializers.ModelSerializer):

	class Meta:

		model=Center
		fields=('id','name','phoneNumber','manager','address')



