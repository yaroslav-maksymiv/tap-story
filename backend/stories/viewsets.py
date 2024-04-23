from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from datetime import datetime

from .models import (
    Category, Story, Character, Comment, IpAddress
)
from .serializers import (
    StorySerializer, CategorySerializer, CommentSerializer, CharacterSerializer
)
from .pagination import MyPagePagination
from authentication.serializers import (
    UserAccountSerializer
)

User = get_user_model()


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


class StoryViewSet(ModelViewSet):
    serializer_class = StorySerializer
    queryset = Story.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = MyPagePagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    search_fields = ['title']
    ordering_fields = ['created_at', 'views']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.queryset)
        # queryset = queryset.filter(published=True)
        page = self.paginate_queryset(queryset)
        if page:
            serializer = self.get_serializer(queryset, many=True)
            return self.get_paginated_response(serializer.data)
        return Response({"error": "Pagination parameters are invalid"}, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None, *args, **kwargs):
        story = get_object_or_404(self.queryset, pk=pk)

        # Handle views
        ip = get_client_ip(request)
        if not IpAddress.objects.filter(ip=ip).exists():
            IpAddress.objects.create(ip=ip)
            story.views.add(IpAddress.objects.get(ip=ip))

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
        story = get_object_or_404(self.queryset, pk=pk)
        if story.author == request.user:
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
        return Response(status=status.HTTP_403_FORBIDDEN)

    @action(detail=True, methods=['POST'], url_path='publish', url_name='story-publish')
    def publish_story(self, request, pk=None):
        story = get_object_or_404(self.queryset, pk=pk)

        if story.author == request.user:
            story.published = True
            story.publish_date = datetime.now()
            story.save()

            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_403_FORBIDDEN)

    @action(detail=True, methods=['POST'], url_path='toggle-like', url_name='toggle-like')
    def toggle_like(self, request):
        story = self.get_object()
        user = request.user

        if user in story.likes.all():
            story.likes.remove(user)
            return Response({'liked': False}, status=status.HTTP_200_OK)
        else:
            story.likes.add(user)
            return Response({'liked': True}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['GET'], url_path='characters', url_name='characters')
    def get_characters(self, request, pk=None):
        story = get_object_or_404(Story, pk=pk)
        if story.author == request.user:
            queryset = story.characters.all()
            serializer = CharacterSerializer(queryset, many=True)
            return Response(serializer.data)
        return Response(status=status.HTTP_403_FORBIDDEN)

    @action(detail=True, methods=['GET'], url_path='comments', url_name='comments')
    def get_comments(self, request, pk=None):
        story = get_object_or_404(Story, pk=pk)
        queryset = story.comments.all()
        page = self.paginate_queryset(queryset)
        if page:
            serializer = CommentSerializer(queryset, many=True)
            return self.get_paginated_response(serializer.data)
        Response({"error": "Pagination parameters are invalid"}, status=status.HTTP_400_BAD_REQUEST)


class CharacterViewSet(ModelViewSet):
    queryset = Character.objects.all()
    serializer_class = CharacterSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        story = get_object_or_404(Story, pk=request.data.get('story'))
        if story.author == request.user:
            character_data = {
                'name': request.data.get('name'),
                'story': story.id
            }
            serializer = self.get_serializer(data=character_data)
            if serializer.is_valid():
                character = serializer.save()
                return Response(self.get_serializer(character).data, status=status.HTTP_201_CREATED)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def partial_update(self, request, pk=None, *args, **kwargs):
        instance = self.get_object()
        if instance.story.author == request.user:
            update_data = {
                'name': request.data.get('name')
            }
            serializer = self.get_serializer(instance, data=update_data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, pk=None, *args, **kwargs):
        instance = get_object_or_404(self.queryset, pk=pk)
        story = Story.objects.get(pk=instance.story.id)
        if story.author == request.user:
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)


class CommentViewSet(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        story = get_object_or_404(Story, pk=request.data.get('story'))
        comment_data = {
            'author': request.user.id,
            'story': story.id,
            'text': request.data.get('text')
        }
        serializer = self.get_serializer(data=comment_data)
        if serializer.is_valid():
            comment = serializer.save()
            return Response(self.get_serializer(comment).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        if instance.author == user:
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def partial_update(self, request, pk=None, *args, **kwargs):
        instance = self.get_object()
        if instance.story.author == request.user:
            update_data = {
                'text': request.data.get('text')
            }
            serializer = self.get_serializer(instance, data=update_data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)

    @action(detail=True, methods=['POST'], url_path='toggle-like', url_name='toggle-like')
    def toggle_like(self, request, *args, **kwargs):
        comment = self.get_object()
        user = request.user

        if user in comment.likes.all():
            comment.likes.remove(user)
            return Response({'liked': False}, status=status.HTTP_200_OK)
        else:
            comment.likes.add(user)
            return Response({'liked': True}, status=status.HTTP_200_OK)
