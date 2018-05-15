from django.contrib.auth.models import User

from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from guilds.models import Guild
from guilds.serializers import GuildSerializer
from user_profiles.models import UserProfile


class GuildViewSet(viewsets.ModelViewSet):
    queryset = Guild.objects.order_by('created_at')
    serializer_class = GuildSerializer


@api_view(['POST'])
def add_users_to_guild(request):
    data = request.data['data']

    try:
        if len(data) > 0:
            for row in data:
                guild, guild_created = Guild.objects.get_or_create(name=row['guild_name'])
                mobile = row['number']
                first_name = row['first_name']
                last_name = row['last_name']
                user_to_be_added, created = UserProfile.objects.get_or_create(mobile=mobile)
                user = None

                user, user_created = User.objects.get_or_create(username=str(user_to_be_added.mobile))
                user.first_name = first_name
                user.last_name = last_name
                user.profile = user_to_be_added

                user.save()

                guild.users.add(user_to_be_added)

            return Response({'status': 'ok'}, status.HTTP_200_OK)
    except:
        return Response({'status': 'Something wrong'}, status.HTTP_400_BAD_REQUEST)
