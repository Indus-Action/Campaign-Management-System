from rest_framework import viewsets, generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from follows.models import Follow
from follows.serializers import FollowSerializer, DetailedFollowSerializer


class FollowViewSet(viewsets.ModelViewSet):
    queryset = Follow.objects.order_by('created_at')
    serializer_class = FollowSerializer


class FollowerFollowsView(generics.ListAPIView):
    serializer_class = DetailedFollowSerializer

    def get(self, request, follower_pk=None):
        queryset = Follow.objects.filter(follower=follower_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


class FollowedFollowsView(generics.ListAPIView):
    serializer_class = DetailedFollowSerializer

    def get(self, request, followed_pk=None):
        queryset = Follow.objects.filter(followed__pk=followed_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


@api_view(['GET'])
def get_follow(request):
    follower_id = request.GET.get('follower_id')
    followed_id = request.GET.get('followed_id')

    follow_object = None
    follow_status = status.HTTP_404_NOT_FOUND

    serializer_class = FollowSerializer

    try:
        follow_object = Follow.objects.get(follower__pk=follower_id, followed__pk=followed_id)
        follow_object = serializer_class(follow_object).data
        follow_status = status.HTTP_200_OK
    except:
        pass

    return Response({'follow_object': follow_object}, status=follow_status)
