from rest_framework import viewsets, generics
from rest_framework.response import Response

from task_comments.models import TaskComment
from task_comments.serializers import TaskCommentSerializer, TaskCommentDetailedSerializer


class TaskCommentViewSet(viewsets.ModelViewSet):
    queryset = TaskComment.objects.order_by('created_at')
    serializer_class = TaskCommentSerializer


class TaskCommentDetailedViewSet(viewsets.ModelViewSet):
    queryset = TaskComment.objects.order_by('created_at')
    serializer_class = TaskCommentDetailedSerializer


class TaskCommentsView(generics.ListAPIView):
    serializer_class = TaskCommentDetailedSerializer

    def get(self, request, task_pk=None):
        queryset = TaskComment.objects.filter(task__pk=task_pk).order_by('-created_at')
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


class CommentedCommentsView(generics.ListAPIView):
    serializer_class = TaskCommentDetailedSerializer

    def get(self, request, commentor_pk=None):
        queryset = TaskComment.objects.filter(commentor__pk=commentor_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)
