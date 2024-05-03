from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

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
        return queryset
