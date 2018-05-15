from django.http import JsonResponse

from rest_framework import viewsets

from actions.models import Action
from actions.serializers import ActionSerializer


def get_action_classes(request):
    action_classes = [{'desc': sub_class.desc, 'name': sub_class.name} for sub_class in Action.__subclasses__()]

    return JsonResponse({'data': action_classes})


class ActionViewSet(viewsets.ModelViewSet):
    queryset = Action.objects.all()
    serializer_class = ActionSerializer
