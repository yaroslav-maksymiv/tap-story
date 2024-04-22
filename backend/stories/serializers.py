from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

from .models import (
    Category, Story, Character, Comment
)
from authentication.serializers import (
    UserAccountSerializer
)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class StorySerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())

    class Meta:
        model = Story
        fields = ['id', 'title', 'description', 'author', 'category', 'image']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['likes_count'] = instance.get_count_likes()
        representation['comments_count'] = instance.get_count_comments()
        representation['views'] = instance.views

        if instance.image:
            representation['image'] = self.context['request'].build_absolute_uri(instance.image.url)
        else:
            representation['image'] = None

        if 'request' in self.context:
            representation['author'] = UserAccountSerializer(instance.author).data
            representation['category'] = CategorySerializer(instance.category).data

        return representation


class CharacterSerializer(serializers.ModelSerializer):
    story = serializers.PrimaryKeyRelatedField(queryset=Story.objects.all())

    class Meta:
        model = Character
        fields = ['id', 'name', 'story']


class CommentSerializer(serializers.ModelSerializer):
    author = UserAccountSerializer()
    story = serializers.PrimaryKeyRelatedField(queryset=Story.objects.all())

    class Meta:
        model = Comment
        fields = ['id', 'author', 'story', 'text']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['likes_count'] = instance.get_count_likes()
        return representation
