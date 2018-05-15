from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import list_route

from locations.models import Location
from locations.serializers import LocationSerializer


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            location = Location.objects.get(
                    description = request.data.get('description',''),
                    street_number = request.data.get('street_number',''),
                    route = request.data.get('route',''),
                    sublocality_level_3 = request.data.get('sublocality_level_3',''),
                    sublocality_level_2 = request.data.get('sublocality_level_2',''),
                    sublocality_level_1 = request.data.get('sublocality_level_1',''),
                    locality = request.data.get('locality',''),
                    administrative_area_level_2 =
                        request.data.get('administrative_area_level_2',''),
                    administrative_area_level_1 =
                        request.data.get('administrative_area_level_1',''),
                    country = request.data.get('country',''),
                    postal_code = request.data.get('postal_code',''),
                    lat = request.data.get('lat',0),
                    lng = request.data.get('lng',0)
                )
            headers = self.get_success_headers(serializer.data)
            response = Response(data = self.get_serializer(location).data,
                    status=status.HTTP_202_ACCEPTED, headers=headers)
        except Location.DoesNotExist:
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            response = Response(serializer.data, status=status.HTTP_201_CREATED,
                headers=headers)
        return response

    @list_route()
    def search_nearby_using_text(self, request):
        # TODO: Write this method
        # text = request.GET.get('text')
        pass

    @list_route()
    def search_nearby_using_lat_lng(self, request):
        # TODO: Write this method
        pass
