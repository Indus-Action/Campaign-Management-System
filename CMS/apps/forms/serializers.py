from rest_framework import serializers

from forms.models import Form, FormData, PersistentForm, PersistentFormData

class FormSerializer(serializers.ModelSerializer):
    class Meta:
        model = Form
        fields = ('id', 'name', 'description', 'schema',)
        read_only_fields = ('id', 'created_at', 'updated_at',)


class PersistentFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersistentForm
        fields = ('id', 'name', 'description', 'persistent', 'schema',)
        read_only_fields = ('id', 'created_at', 'updated_at',)


class FormDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormData
        fields = ('id', 'form', 'data','beneficiary_form',)


class PersistentFormDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersistentFormData
        fields = ('id', 'form', 'data', 'persistent', 'beneficiary',)
