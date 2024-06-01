from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

from .models import (
    Category, Story, Character,
    Comment, SavedStory, Episode,
    Message
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
    is_saved = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Story
        fields = [
            'id', 'title', 'description', 'author',
            'category', 'image', 'is_liked', 'is_saved'
        ]

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

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request:
            user = request.user
            if user.is_authenticated and SavedStory.objects.filter(user=user, story=obj).exists():
                return True
            return False
        return False


class CharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Character
        fields = ['id', 'name', 'story', 'color']

    def validate(self, data):
        instance = self.instance
        story = data.get('story', instance.story if instance else None)

        name = data.get('name')
        if name:
            if Character.objects.filter(story=story, name=name).exists():
                raise serializers.ValidationError("This name is already in use.")

        color = data.get('color')
        if color:
            color = color.upper()
            if Character.objects.filter(story=story, color=color).exists():
                raise serializers.ValidationError("This color is already in use.")

        return data


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
        fields = ['user', 'story']

    def to_representation(self, instance):
        return StorySerializer(instance.story, context={'request': self.context.get('request')}).data


class EpisodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Episode
        fields = ['id', 'title', 'story']


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = [
            'id', 'message_type', 'order', 'character', 'episode',
            'text_content', 'image_content', 'video_content', 'audio_content',
            'status_content'
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')

        if instance.character:
            representation['character'] = CharacterSerializer(instance.character).data

        if request:
            if instance.image_content:
                representation['image_content'] = request.build_absolute_uri(instance.image_content.url)
            if instance.video_content:
                representation['video_content'] = request.build_absolute_uri(instance.video_content.url)
            if instance.audio_content:
                representation['audio_content'] = request.build_absolute_uri(instance.audio_content.url)

        return representation
