from rest_framework import viewsets

from organisations.models import Organisation
from organisations.serializers import OrganisationSerializer


class OrganisationViewSet(viewsets.ModelViewSet):
    queryset = Organisation.objects.all()
    serializer_class = OrganisationSerializer
