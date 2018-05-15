from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from dbmodels.models import Address,IAUser,Center
from dbmodels.serializers import AddressSerializer,IAUserSerializer,CenterSerializer

@csrf_exempt
def address_list(request):
    """
    List all addresses, or create new addresses.
    """
    if request.method == 'GET':
        addresses = Address.objects.all()
        serializer = AddressSerializer(addresses, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = AddressSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)



@csrf_exempt
def address_detail(request, pk):
    """
    Retrieve, update or delete an address
    """
    try:
        address = Address.objects.get(pk=pk)
    except Address.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = AddressSerializer(address)
        return JsonResponse(serializer.data)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = AddressSerializer(address, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

   


@csrf_exempt
def user_list(request):
    """
    List all addresses, or create new users.
    """
    if request.method == 'GET':
        users = IAUser.objects.all()
        serializer = IAUserSerializer(users, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = IAUserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    


@csrf_exempt
def user_detail(request, pk):
    """
    Retrieve, update or delete an address
    """
    try:
        user = IAUser.objects.get(pk=pk)
    except IAUser.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = IAUserSerializer(user)
        return JsonResponse(serializer.data)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = IAUserSerializer(user, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)


@csrf_exempt
def center_list(request):
    """
    List all addresses, or create new users.
    """
    if request.method == 'GET':
        centers = Center.objects.all()
        serializer = CenterSerializer(centers, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = CenterSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    


@csrf_exempt
def center_detail(request, pk):
    """
    Retrieve, update or delete an address
    """
    try:
        center = Center.objects.get(pk=pk)
    except Center.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = CenterSerializer(center)
        return JsonResponse(serializer.data)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = CenterSerializer(center, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

