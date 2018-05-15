from rest_framework import viewsets, generics
from rest_framework.response import Response

from todos.models import Todo
from todos.serializers import TodoSerializer


class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.order_by('-created_at')
    serializer_class = TodoSerializer


class AssignedTodosView(generics.ListAPIView):
    serializer_class = TodoSerializer

    def get(self, request, user_pk=None):
        queryset = Todo.objects.filter(assignee=user_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


class CreatedTodosView(generics.ListAPIView):
    serializer_class = TodoSerializer

    def get(self, request, user_pk=None):
        queryset = Todo.objects.filter(reporter=user_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


class BeneficiaryTodosView(generics.ListAPIView):
    serializer_class = TodoSerializer

    def get(self, request, user_pk=None):
        queryset = Todo.objects.filter(beneficiary=user_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)
