from django.contrib.auth.models import User

from rest_framework import generics, views, viewsets, status
from rest_framework.response import Response

from interests.models import Interest
from interests.serializers import InterestSerializer, LightInterestSerializer


class InterestViewSet(viewsets.ModelViewSet):
    queryset = Interest.objects.all()
    serializer_class = InterestSerializer


class LightInterestViewSet(viewsets.ModelViewSet):
    queryset = Interest.objects.all()
    serializer_class = LightInterestSerializer


class UserInterestsView(generics.ListAPIView):
    serializer_class = LightInterestSerializer

    def get(self, request, user_pk=None):
        queryset = Interest.objects.filter(users__pk__in=[user_pk])
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


class AddInterestsToUser(views.APIView):
    def post(self, request):
        user_id = request.data['user_id']
        interest_ids = request.data['interest_ids']

        user = User.objects.get(pk=user_id)

        for interest_id in interest_ids:
            interest = Interest.objects.get(pk=interest_id)
            user.interests.add(interest)

        return Response({'status': 'Interests added'}, status.HTTP_200_OK)


class RemoveInterestsFromUser(views.APIView):
    def post(self, request):
        interest_ids = request.data['interest_ids']
        user_id = request.data['user_id']

        for interest_id in interest_ids:
            interest = Interest.objects.get(pk=interest_id)
            user.interests.remove(interest)

        return Response({'status': 'Interest removed'}, status.HTTP_200_OK)
