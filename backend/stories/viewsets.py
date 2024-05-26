from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.db.models import Count
from datetime import datetime

from .models import (
    Category, Story, Character,
    Comment, IpAddress, SavedStory,
    Episode, Message
)
from .serializers import (
    StorySerializer, CommentSerializer,
    CharacterSerializer, SavedStorySerializer, EpisodeSerializer,
    MessageSerializer
)
from .pagination import MyPagePagination
from authentication.serializers import (
    UserAccountSerializer, Notification
)

User = get_user_model()


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def destroy_by_story_pk(pk, user, queryset):
    instance = get_object_or_404(queryset, pk=pk)
    story = Story.objects.get(pk=instance.story.id)
    if story.author == user:
        instance.delete()
        # 204 response
        return True
    # forbidden 403 error
    return False


def validate_unique_order(order, queryset):
    if order:
        try:
            order = float(order)
            if order > 0:
                if queryset.filter(order=order).exists():
                    raise ValidationError("Instance with this order already exists.")
                else:
                    return order
            else:
                raise ValidationError('Order must be greater than zero.')
        except ValueError:
            raise ValidationError('Order must be a valid float.')
    else:
        raise ValidationError('Order must be a valid float greater than zero.')


class StoryViewSet(ModelViewSet):
    serializer_class = StorySerializer
    queryset = Story.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = MyPagePagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    search_fields = ['title']
    ordering_fields = ['created_at', 'likes_count']

    def list(self, request, *args, **kwargs):
        queryset = self.queryset.annotate(likes_count=Count('likes'))
        category_id = request.query_params.get('category')
        if category_id:
            category = get_object_or_404(Category, pk=category_id)
            queryset = queryset.filter(category=category)
        queryset = self.filter_queryset(queryset)
        queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(queryset, many=True)
        return self.get_paginated_response(serializer.data)

    def retrieve(self, request, pk=None, *args, **kwargs):
        story = self.get_object()

        # Handle views
        ip = get_client_ip(request)
        if not story.views.filter(ip=ip).exists():
            ip_address, created = IpAddress.objects.get_or_create(ip=ip)
            story.views.add(ip_address.id)

        serializer = self.get_serializer(story, context={'request': request})
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
        story = self.get_object()
        if story.author == request.user:
            category = get_object_or_404(Category, id=request.data.get('category'))

            update_data = {
                'title': request.data.get('title'),
                'description': request.data.get('description'),
                'author': request.user.id,
                'category': category.id,
            }

            image = request.FILES.get('image')
            if image:
                update_data['image'] = request.FILES.get('image')

            serializer = self.get_serializer(story, data=update_data)

            if serializer.is_valid():
                updated_story = serializer.save()
                return Response(self.get_serializer(updated_story).data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)

    @action(detail=False, methods=['GET'], permission_classes=[IsAuthenticated], url_path='my', url_name='my')
    def get_my_stories(self, request, pk=None):
        queryset = self.queryset.filter(author=request.user)
        queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        return self.get_paginated_response(serializer.data)

    @action(detail=True, methods=['POST'], url_path='publish', url_name='publish')
    def publish_story(self, request, pk=None):
        story = self.get_object()

        if story.author == request.user:
            story.published = True
            story.publish_date = datetime.now()
            story.save()

            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_403_FORBIDDEN)

    @action(detail=True, methods=['POST'], url_path='toggle-like', url_name='toggle-like')
    def toggle_like(self, request, pk=None):
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
        story = self.get_object()
        if story.author == request.user:
            queryset = story.characters.all()
            serializer = CharacterSerializer(queryset, many=True)
            return Response(serializer.data)
        return Response(status=status.HTTP_403_FORBIDDEN)

    @action(detail=True, methods=['GET'], url_path='episodes', url_name='episodes')
    def get_episodes(self, request, pk=None):
        story = self.get_object()
        queryset = story.episodes.all()
        serializer = EpisodeSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'], url_path='comments', url_name='comments')
    def get_comments(self, request, pk=None):
        story = self.get_object()
        queryset = story.comments.all()
        queryset = self.paginate_queryset(queryset)
        serializer = CommentSerializer(queryset, many=True, context={'request': request})
        return self.get_paginated_response(serializer.data)

    @action(detail=False, methods=['GET'], permission_classes=[IsAuthenticated], url_path='liked', url_name='liked')
    def get_liked(self, request):
        user = request.user
        queryset = user.stories_liked.all()
        queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(queryset, many=True)
        return self.get_paginated_response(serializer.data)

    @action(detail=False, methods=['GET'], url_path='random', url_name='random')
    def get_random(self, request, *args, **kwargs):
        random_story = self.queryset.order_by('?').first()
        return Response(self.get_serializer(random_story).data)


class CharacterViewSet(ModelViewSet):
    queryset = Character.objects.all()
    serializer_class = CharacterSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        story = get_object_or_404(Story, pk=request.data.get('story'))
        if story.author == request.user:
            character_data = {
                'name': request.data.get('name'),
                'story': story.id,
                'color': request.data.get('color')
            }
            serializer = self.get_serializer(data=character_data)
            if serializer.is_valid():
                character = serializer.save()
                return Response(self.get_serializer(character).data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def partial_update(self, request, pk=None, *args, **kwargs):
        instance = self.get_object()
        if instance.story.author == request.user:
            update_data = {}
            if 'name' in request.data:
                update_data['name'] = request.data.get('name')
            if 'color' in request.data:
                update_data['color'] = request.data.get('color')
            serializer = self.get_serializer(instance, data=update_data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, pk=None, *args, **kwargs):
        if destroy_by_story_pk(pk, request.user, self.get_queryset()):
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)


class CommentViewSet(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        user = request.user
        story = get_object_or_404(Story, pk=request.data.get('story'))
        comment_text = request.data.get('text')
        comment_data = {
            'author': user.id,
            'story': story.id,
            'text': comment_text
        }
        serializer = self.get_serializer(data=comment_data)
        if serializer.is_valid():
            comment = serializer.save()

            # create notification
            if request.user != story.author:
                message = f'Commented story "{story.title}": {comment_text}'
                Notification.objects.create(recipient=story.author, sender=user, message=message)

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
        if instance.author == request.user:
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


class SavedStoryViewSet(ModelViewSet):
    queryset = SavedStory.objects.all()
    pagination_class = MyPagePagination
    serializer_class = SavedStorySerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        story = get_object_or_404(Story, pk=request.data.get('story'))
        save_date = {
            'user': request.user.id,
            'story': story.id
        }
        serializer = self.get_serializer(data=save_date)
        if serializer.is_valid():
            saved_story = serializer.save()
            return Response(self.get_serializer(saved_story).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        user = request.user
        queryset = self.get_queryset().filter(user=user)
        queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(queryset, many=True)
        return self.get_paginated_response(serializer.data)

    @action(detail=False, methods=['DELETE'], permission_classes=[IsAuthenticated], url_name='delete')
    def delete(self, request):
        user = request.user
        story = get_object_or_404(Story, pk=request.data.get('story'))
        if story.author != user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        instance = get_object_or_404(SavedStory, user=user, story=story)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class EpisodeViewSet(ModelViewSet):
    queryset = Episode.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = EpisodeSerializer
    pagination_class = MyPagePagination

    def create(self, request, *args, **kwargs):
        story = get_object_or_404(Story, pk=request.data.get('story'))
        if story.author == request.user:
            episode_data = {
                'title': request.data.get('title'),
                'story': story.id
            }
            serializer = self.get_serializer(data=episode_data)
            if serializer.is_valid():
                character = serializer.save()
                return Response(self.get_serializer(character).data, status=status.HTTP_201_CREATED)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def update(self, request, *args, **kwargs):
        episode = self.get_object()
        if episode.story.author == request.user:
            update_data = {
                'title': request.data.get('title')
            }
            serializer = self.get_serializer(episode, data=update_data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, pk=None, *args, **kwargs):
        if destroy_by_story_pk(pk, request.user, self.get_queryset()):
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)

    @action(detail=True, methods=['GET'], url_path='messages', url_name='messages')
    def get_messages(self, request, pk=None):
        episode = get_object_or_404(Episode, pk=pk)
        queryset = episode.messages.all().order_by('order')
        queryset = self.paginate_queryset(queryset)
        serializer = MessageSerializer(queryset, many=True, context={'request': request})
        return self.get_paginated_response(serializer.data)


class MessageViewSet(ModelViewSet):
    queryset = Message.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        episode = get_object_or_404(Episode, pk=data.get('episode'))

        if request.user != episode.story.author:
            return Response(status=status.HTTP_403_FORBIDDEN)

        try:
            order = validate_unique_order(data.get('order'), Message.objects.filter(episode=episode))
        except ValidationError as err:
            return Response({'message': str(err.messages[0])}, status=status.HTTP_400_BAD_REQUEST)

        message_type = data.get('message_type')
        message = self.create_message(episode, order, message_type, data)

        if not message:
            return Response({'message': 'Invalid message type.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(self.get_serializer(message).data, status=status.HTTP_201_CREATED)

    def create_message(self, episode, order, message_type, data):
        if message_type == 'status':
            return Message.objects.create(
                episode=episode, order=order,
                message_type=message_type, status_content=data.get('status_content')
            )
        else:
            character = get_object_or_404(Character, pk=data.get('character'))

            message_content = {
                'text': 'text_content',
                'image': 'image_content',
                'video': 'video_content',
                'audio': 'audio_content'
            }.get(message_type)

            if not message_content or not data.get(message_content):
                return None

            return Message.objects.create(
                episode=episode, order=order, character=character,
                message_type=message_type, **{message_content: data.get(message_content)}
            )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data

        if request.user != instance.episode.story.author:
            return Response(status=status.HTTP_403_FORBIDDEN)

        message_type = instance.message_type
        if message_type == 'status':
            serializer = self.get_serializer(
                instance,
                data={'status_content': data.get('status_content')},
                partial=True
            )
        else:
            message_content = {
                'text': 'text_content',
                'image': 'image_content',
                'video': 'video_content',
                'audio': 'audio_content'
            }.get(message_type)
            update_data = {
                message_content: data.get(message_content)
            }

            character = data.get('character')
            if character:
                character = get_object_or_404(Character, pk=character)
                update_data['character'] = character.pk

            serializer = self.get_serializer(instance, data=update_data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.episode.story.author == request.user:
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)

    @action(detail=True, methods=['PATCH'], url_path='order', url_name='order')
    def update_order(self, request, pk=None):
        message = self.get_object()

        if request.user != message.episode.story.author:
            return Response(status=status.HTTP_403_FORBIDDEN)

        try:
            order = validate_unique_order(request.data.get('order'), Message.objects.filter(episode=message.episode))
        except ValidationError as err:
            return Response({'message': str(err.messages[0])}, status=status.HTTP_400_BAD_REQUEST)

        message.order = order
        message.save()
        return Response(status=status.HTTP_200_OK)
