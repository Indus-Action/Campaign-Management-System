from rest_framework import serializers

from calls.models import Call


class CallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Call

        fields = ('id', 'start_time', 'end_time', 'beneficiary', 'caller', 'created_at', 'updated_at', 'end', 'task','mobile',)

        read_only_fields = ('id', 'created_at', 'updated_at')
