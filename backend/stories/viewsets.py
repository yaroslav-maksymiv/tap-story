from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404

from .models import (
    Category, Story, Character, Comment
)
from .serializers import (
    StorySerializer, CategorySerializer, CommentSerializer, CharacterSerializer
)
from authentication.serializers import (
    UserAccountSerializer
)


class StoryViewSet(ModelViewSet):
    serializer_class = StorySerializer
    queryset = Story.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    search_fields = ['title']
    ordering_fields = ['created_at', 'views']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.queryset)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None, *args, **kwargs):
        story = get_object_or_404(self.queryset, pk=pk)
        serializer = self.get_serializer(story)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        user = request.user

        category = get_object_or_404(Category, id=request.data.get('category'))

        story_data = {
            'title': request.data.get('title'),
            'description': request.data.get('description'),
            'author': user.id,
            'category': category.id,
            'image': request.FILES.get('image')
        }

        serializer = self.get_serializer(data=story_data)

        if serializer.is_valid():
            story = serializer.save()
            return Response(self.get_serializer(story).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None, *args, **kwargs):
        story = get_object_or_404(self.queryset, pk=pk, author=request.user.id)
        category = get_object_or_404(Category, id=request.data.get('category'))

        update_data = {
            'title': request.data.get('title'),
            'description': request.data.get('description'),
            'author': request.user.id,
            'category': category.id,
            'image': request.FILES.get('image')
        }

        serializer = self.get_serializer(story, data=update_data)

        if serializer.is_valid():
            updated_story = serializer.save()
            return Response(self.get_serializer(updated_story).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['POST'], url_path='publish', url_name='story-publish')
    def publish_story(self, request, pk=None):
        story = get_object_or_404(self.queryset, pk=pk, author=request.user.id)

        story.published = True
        story.save()

        return Response(status=status.HTTP_200_OK)


class CharacterViewSet(ModelViewSet):
    queryset = Character.objects.all()
    serializer_class = CharacterSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        story = get_object_or_404(Story, pk=request.query_params.get('story'))
        if story.author == request.user.id:
            queryset = self.queryset.filter(story=story.id)
            return Response(self.get_serializer(queryset, many=True).data)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def create(self, request, *args, **kwargs):
        story = get_object_or_404(Story, pk=request.data.get('story'))
        if story.author == request.user.id:
            character_data = {
                'name': request.data.get('name'),
                'story': story.id
            }
            serializer = self.get_serializer(data=character_data)
            if serializer.is_valid():
                serializer = serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, pk=None, *args, **kwargs):
        instance = get_object_or_404(self.queryset, pk=pk)
        story = Story.objects.get(pk=instance.story)
        if story.author == request.user.id:
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)
