from rest_framework import serializers

from tags.models import Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag

        fields = ('id', 'tag', 'desc', 'created_at', 'updated_at', 'mutually_exclusive_tags')
        read_only_fields = ('id', 'created_at', 'updated_at', 'users')


class LightTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag

        fields = ('id', 'tag', 'desc',)
        read_only_fields = ('id',)
