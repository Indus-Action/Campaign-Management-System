from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from spaces.models import Space
from space_types.models import SpaceType
from space_types.serializers import SpaceTypeSerializer


class SpaceTypeViewSet(viewsets.ModelViewSet):
    queryset = SpaceType.objects.all()
    serializer_class = SpaceTypeSerializer


@api_view(['POST'])
def add_spaces(request):
    data = request.data

    try:
        if data['spaces'] and data['space_type']:
            spaces = data['spaces']
            space_type = SpaceType.objects.get(pk=data['space_type'])

            for space in spaces:
                if 'lat' not in space.keys() or 'lng' not in space.keys():
                    space['lat'] = space['lng'] = 0

                space_to_be_added, created = Space.objects.get_or_create(name=space['name'],
                                                                         address=space['address'],
                                                                         lat=space['lat'],
                                                                         lng=space['lng'])

                if 'rating' in space.keys():
                    space_to_be_added.rating = space['rating']
                    space_to_be_added.save()

                space_type.spaces.add(space_to_be_added)

            return Response({'status': 'ok'}, status.HTTP_200_OK)
    except Exception, e:
        return Response({'status': 'Something wrong'}, status.HTTP_400_BAD_REQUEST)
