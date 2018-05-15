from rest_framework import serializers

from guilds.models import Guild


class GuildSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guild

        fields = ('id', 'name', 'description', 'created_at', 'updated_at',)
        read_only_fields = ('id', 'created_at', 'updated_at',)
