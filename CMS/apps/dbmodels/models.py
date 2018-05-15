from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Address(models.Model):
	
	addressLineOne=models.CharField(max_length=50)
	addressLineTwo=models.CharField(max_length=50)
	district=models.CharField(max_length=20)
	state=models.CharField(max_length=20)
	pincode=models.CharField(max_length=20)	
	country=models.CharField(max_length=20)


class IAUser(models.Model):

	firstName=models.CharField(max_length=20)
	lastName=models.CharField(max_length=20)
	phoneNumber=models.CharField(max_length=11,unique=True,null=False)
	email=models.EmailField(max_length=254,unique=True,null=True)
	address=models.OneToOneField(Address,related_name='staff_address',null=True)
	hashValue=models.CharField(max_length=256,null=True)


class Center(models.Model):

	name=models.CharField(max_length=20)
	phoneNumber=models.CharField(max_length=20,null=True)
	manager=models.OneToOneField(IAUser,related_name='manager',null=True)
	address=models.OneToOneField(Address,related_name='center_address',null=True)


class IAParent(models.Model):

	firstName=models.CharField(max_length=20)
	lastName=models.CharField(max_length=20)
	phoneNumber=models.CharField(max_length=20,unique=True,null=False)
	email=models.EmailField(max_length=254,unique=True,null=True)
	address=models.OneToOneField(Address,related_name='parent_address',null=True)


class Child(models.Model):

	firstName=models.CharField(max_length=20)
	lastName=models.CharField(max_length=20)
	dateOfBirth=models.DateField(auto_now=False,null=True)
	age=models.CharField(max_length=3)
	parent=models.ForeignKey(IAParent,on_delete=models.SET_NULL,null=True)


class Kit(models.Model):

	name=models.CharField(max_length=20)
	description=models.CharField(max_length=20)
	price=models.CharField(max_length=5)

class Question(models.Model):

	text=models.CharField(max_length=50)
	max_marks=models.CharField(max_length=20)

class Assessment(models.Model):

	kits=models.ManyToManyField(Kit)
	questions=models.ManyToManyField(Question)

class AssessmentReport(models.Model):
	date=models.DateField(auto_now=True,null=True)
	child=models.OneToOneField(Child,related_name='child',null=False)
	assessment=models.OneToOneField(Assessment,related_name='assessment',null=False)

class AssessmentScore(models.Model):
	question=models.OneToOneField(Question,related_name='question',null=False)
	score=models.CharField(max_length=3)
	report=models.ForeignKey(AssessmentReport,on_delete=models.SET_NULL,null=True)


class Transaction(models.Model):
	
	date=models.DateField(auto_now=True,null=True)
	parent=models.OneToOneField(IAParent,null=True)
	iaUser=models.OneToOneField(IAUser,null=True)
	kit=models.OneToOneField(Kit,null=True)
	amount=models.CharField(max_length=10)










