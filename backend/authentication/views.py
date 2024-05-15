from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from .models import (
    Notification
)
from .serializers import (
    NotificationSerializer
)
from stories.pagination import MyPagePagination


class NotificationListAPIView(ListAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = MyPagePagination

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        queryset = queryset.filter(recipient=user)
        unread_queryset = queryset.filter(is_read=False)
        unread_queryset.update(is_read=True)
        return queryset


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def count_unread_notifications(request):
    count_unread = Notification.objects.filter(recipient=request.user, is_read=False).count()
    return Response({'count': count_unread}, status=status.HTTP_200_OK)
