from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status

from .models import (
    Category, Story, Message, Episode, UserStoryStatus
)
from .serializers import (
    CategorySerializer, UserStoryStatusSerializer
)


class CategoryListView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class UpdateUserStoryStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        story_id = request.query_params.get('story_id')
        story = get_object_or_404(Story, id=story_id)
        user_story_status = get_object_or_404(UserStoryStatus, user=user, story=story)
        if user_story_status.episode and user_story_status.message:
            return Response(UserStoryStatusSerializer(user_story_status).data)

    def post(self, request):
        user = request.user
        story_id = request.data.get('story_id')
        episode_id = request.data.get('episode_id')
        message_id = request.data.get('message_id')

        story = get_object_or_404(Story, id=story_id)
        episode = get_object_or_404(Episode, id=episode_id)
        message = get_object_or_404(Message, id=message_id)

        user_status, created = UserStoryStatus.objects.update_or_create(
            user=user,
            story=story,
            defaults={'episode': episode, 'message': message}
        )

        return Response({'status': 'status updated'}, status=status.HTTP_200_OK)
