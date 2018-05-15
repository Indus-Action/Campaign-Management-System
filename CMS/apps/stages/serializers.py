from rest_framework import serializers

from stages.models import Stage

from rest_framework import serializers


class StageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stage

        fields = ('id', 'task_type', 'name', 'desc', 'create_task_on_transition',
                  'created_at', 'updated_at')

        read_only_fields = ('id', 'created_at', 'updated_at')
