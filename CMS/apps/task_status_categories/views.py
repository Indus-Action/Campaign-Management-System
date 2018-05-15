from django.http import JsonResponse

from rest_framework import viewsets, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view

from task_status_categories.models import TaskStatusCategory
from task_status_categories.serializers import TaskStatusCategorySerializer


class TaskStatusCategoryViewSet(viewsets.ModelViewSet):
    queryset = TaskStatusCategory.objects.order_by('-created_at')
    serializer_class = TaskStatusCategorySerializer

    def perform_create(self, serializer):
        instance = serializer.save(creator=self.request.user)

        return super(TaskStatusCategoryViewSet, self).perform_create(serializer)


class CreatedTaskStatusCategoriesView(generics.ListAPIView):
    serializer_class = TaskStatusCategorySerializer

    def get(self, request, user_pk=None):
        queryset = TaskStatusCategory.objects.filter(creator__pk=user_pk)
        serializer = self.serializer_class(queryset)

        return Response(serializer.data)


@api_view(['GET'])
def getTaskCompletedFlagChoices(request):
    return JsonResponse(dict(TaskStatusCategory.TASK_COMPLETED_FLAG_CHOICES),
            safe=False)
