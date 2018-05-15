from rest_framework import viewsets,status
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.contrib.auth.models import User

from user_profiles.permissions import *

from forms.models import Form, FormData, PersistentForm, PersistentFormData
from forms.serializers import FormSerializer, FormDataSerializer, PersistentFormSerializer, PersistentFormDataSerializer
from forms.models import FormData
import copy


class FormViewSet(viewsets.ModelViewSet):
    queryset = Form.objects.all()
    serializer_class = FormSerializer

    def add_persistent_fields(self, serializer):
        fields = copy.deepcopy(serializer.validated_data['schema'])
        persistent_form = None
        persistent_found = False
        new_field_id = -1

        for field in fields:
            if 'persistent' in field.keys() and field['persistent']:
                if not persistent_form:
                    persistent_form, created = PersistentForm.objects.get_or_create(persistent=True)

                for p_field in persistent_form.schema:
                    if int(p_field['id']) > new_field_id:
                        new_field_id = int(p_field['id'])
                
                if (field['type'] == 'nestedfield' and not any(field['fields']['name'] == p_field['fields']['name'] for p_field in persistent_form.schema if p_field['type'] == 'nested_field')) or \
                (not any(field['title'] == p_field['title'] for p_field in persistent_form.schema)):
                    persistent_found = True
                    serializer.validated_data['schema'].remove(field)
                    field['id'] = new_field_id + 1
                    persistent_form.schema.append(field)
                else:
                    serializer.validated_data['schema'].remove(field)

        if persistent_found:
            persistent_form.save()

        serializer.save()

    def perform_create(self, serializer):
        self.add_persistent_fields(serializer)

    def perform_update(self, serializer):
        if len(serializer.validated_data['schema']) > 0:
            self.add_persistent_fields(serializer)
        else:
            serializer.save()


class FormDataViewSet(viewsets.ModelViewSet):
    queryset = FormData.objects.all()
    serializer_class = FormDataSerializer
    permission_classes = (AnyUserReadWritePermission,)


class PersistentFormDataView(generics.ListAPIView):
    serializer_class = PersistentFormDataSerializer

    def get(self, request, user_pk=None):
        beneficiary = User.objects.get(pk=user_pk)
        persistent_form, created = PersistentForm.objects.get_or_create(name="Persistent Form",
                                                                        description="Persistent Form")

        queryset, created = PersistentFormData.objects.get_or_create(beneficiary=beneficiary,
                                                            form=persistent_form)
        serializer = self.serializer_class(queryset)

        return Response(serializer.data)



class DataByFormView(generics.ListAPIView):
    serializer_class = FormDataSerializer
    permission_classes = (AnyUserReadOnlyPermission,)

    def get_queryset(self):
        form_id = self.kwargs['form_id']
        return FormData.objects.filter(form = form_id)


class PersistentFormViewSet(viewsets.ModelViewSet):
    queryset = PersistentForm.objects.all()
    serializer_class = PersistentFormSerializer


@api_view(['GET'])
def export_filtered_form_data(request):

    args_dict=dict(request.GET.iterlists())
    form_id=None
    beneficiary_id=None

    if('form_id' not in args_dict.keys()):
        return Response({'Error': 'Form id missing'},
                        status=status.HTTP_400_BAD_REQUEST)
    else:
        form_id=args_dict['form_id']


    if('beneficiary_id' not in args_dict.keys()):
        return Response({'Error': 'Beneficiary id missing'},
                        status=status.HTTP_400_BAD_REQUEST)
    else:
        beneficiary_id=args_dict['beneficiary_id']

    
    form_data=FormData.objects.filter(beneficiary_form__id=beneficiary_id[0]).filter(form__id=form_id[0])

    if(len(form_data)>0):

        return Response(FormDataSerializer(form_data[0]).data)
    else:

        return Response({'Error':'No form data found for this form type'},status=status.HTTP_400_BAD_REQUEST)