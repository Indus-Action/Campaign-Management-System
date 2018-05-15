from rest_framework import serializers

from interests.models import Interest


class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = ('id', 'interest', 'desc', 'created_at', 'updated_at',)
        read_only_fields = ('id', 'created_at', 'updated_at',)


class LightInterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = ('id', 'interest', 'desc',)
