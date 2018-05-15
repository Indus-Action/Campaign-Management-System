from rest_framework import serializers

from exotel.models import Exotel


class ExotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exotel

        fields = ('id', 'default_task_type', 'default_task_status', 'default_stage', 'auto_assign', 'created_at', 'updated_at',)

        read_only_fields = ('id', 'created_at', 'updated_at',)
