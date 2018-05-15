from rest_framework import serializers

from training_kits.models import TrainingKit, Page


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page

class TrainingKitSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingKit

class TrainingKitPagesSerializer(serializers.ModelSerializer):
    pages = PageSerializer(many=True)
    class Meta:
        model = TrainingKit
        fields = ('id', 'name', 'description', 'pages')
