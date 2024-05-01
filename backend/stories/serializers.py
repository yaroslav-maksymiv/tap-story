from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

from .models import (
    Category, Story, Character, Comment, SavedStory
)
from authentication.serializers import (
    UserAccountSerializer
)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class StorySerializer(serializers.ModelSerializer):
    is_liked = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Story
        fields = ['id', 'title', 'description', 'author', 'category', 'image', 'is_liked']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['likes_count'] = instance.get_count_likes()
        representation['comments_count'] = instance.get_count_comments()
        representation['views'] = instance.get_count_views()

        if instance.image:
            representation['image'] = self.context['request'].build_absolute_uri(instance.image.url)
        else:
            representation['image'] = None

        if 'request' in self.context:
            representation['author'] = UserAccountSerializer(instance.author).data
            representation['category'] = CategorySerializer(instance.category).data

        return representation

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request:
            user = request.user
            if user.is_authenticated:
                if user in obj.likes.all():
                    return True
            return False
        return False


class CharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Character
        fields = ['id', 'name', 'story']


class CommentSerializer(serializers.ModelSerializer):
    is_liked = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'author', 'story', 'text', 'is_liked']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['likes_count'] = instance.get_count_likes()
        del representation['story']

        if 'request' in self.context:
            representation['author'] = UserAccountSerializer(instance.author).data

        return representation

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request:
            user = request.user
            if user.is_authenticated:
                if user in obj.likes.all():
                    return True
            return False
        return False


class SavedStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedStory
        fields = ['user', 'story', 'saved_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['story'] = StorySerializer(instance.story).data
        return representation

