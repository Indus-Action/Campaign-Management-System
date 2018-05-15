from rest_framework import viewsets, status, views, generics
from rest_framework.response import Response

from django.contrib.auth.models import User

from tags.models import Tag
from tags.serializers import TagSerializer, LightTagSerializer


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.order_by('-created_at')
    serializer_class = TagSerializer


class LightTagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.order_by('-created_at')
    serializer_class = LightTagSerializer


class UserTagsView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def get(self, request, user_pk=None):
        queryset = self.queryset.filter(users__id=user_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


class UserLightTagsView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = LightTagSerializer

    def get(self, request, user_pk=None):
        queryset = self.queryset.filter(users__id=user_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


class AddTagToUser(views.APIView):
    def post(self, request):
        user_id = request.data['user_id']
        tag_id = request.data['tag_id']

        user = User.objects.get(pk=user_id)
        tag = Tag.objects.get(pk=tag_id)

        tags = user.tags.all()
        ex_tags = tag.mutually_exclusive_tags.all()

        add_tag_flag = True

        for t in tags:
            if t in ex_tags:
                add_tag_flag = False
                break

        if add_tag_flag:
            tag.users.add(user)
            tag.save()

            return Response({'status': 'user added'}, status.HTTP_200_OK)
        else:
            return Response({'status': 'Conflict with existing tags'}, status.HTTP_409_CONFLICT)


class AddTagsToUser(views.APIView):
    def post(self, request):
        user_id = request.data['user_id']
        tag_ids = request.data['tag_ids']

        tags = []

        user = User.objects.get(pk=user_id)
        for t in tag_ids:
            tag = Tag.objects.get(pk=t)
            tags.append(tag)

        user_tags = user.tags.all()
        add_tag_flag = True

        for tag in user_tags:
            ex_tags = tag.mutually_exclusive_tags.all()

            add_tag_flag = True

            for t in tags:
                if t in ex_tags:
                    add_tag_flag = False
                    break

        if add_tag_flag:
            for t in tags:
                t.users.add(user)
        else:
            return Response({'status': 'Conflict with existing tags'}, status.HTTP_409_CONFLICT)

        return Response({'status': 'tags added'}, status.HTTP_200_OK)


class AddExclusiveTagToTag(views.APIView):
    def post(self, request):
        ex_tag_id = request.data['ex_tag_id']
        tag_id = request.data['tag_id']

        ex_tag = Tag.objects.get(pk=ex_tag_id)
        tag = Tag.objects.get(pk=tag_id)

        tag.mutually_exclusive_tags.add(ex_tag)
        tag.save()

        return Response({'status': 'Mutually exclusive tag added'}, status.HTTP_200_OK)


class RemoveUserFromTag(views.APIView):
    def post(self, request):
        user_id = request.data['user_id']
        tag_id = request.data['tag_id']

        user = User.objects.get(pk=user_id)
        tag = Tag.objects.get(pk=tag_id)

        tag.users.remove(user)
        tag.save()

        return Response({'status': 'user removed'}, status.HTTP_200_OK)


class RemoveExclusiveTagFromTag(views.APIView):
    def post(self, request):
        ex_tag_id = request.data['ex_tag_id']
        tag_id = request.data['tag_id']

        ex_tag = Tag.objects.get(pk=ex_tag_id)
        tag = Tag.objects.get(pk=tag_id)

        tag.mutually_exclusive_tags.remove(ex_tag)
        tag.save()

        return Response({'status': 'Mutually exclusive tag removed'}, status.HTTP_200_OK)
