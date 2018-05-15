from rest_framework import viewsets, generics
from rest_framework.response import Response

from notes.models import Note
from notes.serializers import NoteSerializer


class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.order_by('-created_at')
    serializer_class = NoteSerializer


class BeneficiaryNotesView(generics.ListAPIView):
    serializer_class = NoteSerializer

    def get(self, request, user_pk=None):
        queryset = Note.objects.filter(beneficiary=user_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


class CreatedNotesView(generics.ListAPIView):
    serializer_class = NoteSerializer

    def get(self, request, user_pk=None):
        queryset = Note.objects.filter(creator__pk=user_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)
