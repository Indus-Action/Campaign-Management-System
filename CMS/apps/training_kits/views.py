import os
import json
from io import BufferedWriter, FileIO

from django.http import JsonResponse
from django.conf import settings

from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser

from user_profiles.permissions import *
from training_kits.models import TrainingKit, Page
from training_kits.serializers import (TrainingKitSerializer, PageSerializer,
        TrainingKitPagesSerializer)

class TrainingKitViewSet(viewsets.ModelViewSet):
    queryset = TrainingKit.objects.all()
    serializer_class = TrainingKitSerializer
    permission_classes = (AdminOrReadOnlyPermission,)

class TrainingKitPagesViewSet(viewsets.ModelViewSet):
    queryset = TrainingKit.objects.all()
    serializer_class = TrainingKitPagesSerializer
    permission_classes = (AnyUserReadOnlyPermission,)

class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    permission_classes = (AdminOrReadOnlyPermission,)

class PageFileUpload(APIView):
    """
    Upload files for pages in training kits
    """

    permission_classes = (AdminOrReadOnlyPermission,)
    parser_classes = (MultiPartParser, FormParser,)

    def post(self, request, format=None):
        file = request.FILES['file']
        page_id = request.META['HTTP_PAGEID']
        pub_upload_dir = settings.USERUPLOADS_DIR
        pub_upload_url = settings.USERUPLOADS_URL

        upload_dir = pub_upload_dir + "/" + page_id + '/'
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)

        filepath = "{}{}".format(upload_dir, file.name)

        try:
            with BufferedWriter(FileIO(filepath, "w")) as dest:
                for c in file.chunks():
                    dest.write(c)
            pub_filepath = pub_upload_url + '/' + page_id + '/' + file.name
            return Response(data={'pub_filepath':pub_filepath},
                    status=status.HTTP_201_CREATED)
        except IOError as e:
            print "I/O error({0}): {1}".format(e.errno, e.strerror)
        return Response(data={'Error':'File save failed.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, format=None):
        """
        Delete page files in training kits
        """

        pub_filepath = request.GET.get('file')
        filepath = (settings.USERUPLOADS_DIR +
                pub_filepath[len(settings.USERUPLOADS_URL):])

        if os.path.exists(filepath) :
            os.remove(filepath)
            return Response(data={'Data': 'File Deleted.'},
                    status=status.HTTP_200_OK)
        else :
            return Response(data={'Error':'File not found.'},
                status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes((AnyUserReadOnlyPermission, ))
def getPageContentTypes(request):
    """
    Get list of all possible Content-types for pages
    """
    return JsonResponse(dict(Page.CONTENT_TYPE_LIST),
            safe=False)
