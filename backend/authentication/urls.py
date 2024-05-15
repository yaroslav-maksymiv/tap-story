from django.urls import path

from .views import (
    NotificationListAPIView,
    count_unread_notifications
)

urlpatterns = [
    path('notifications/', NotificationListAPIView.as_view(), name='notifications'),
    path('notifications/count-unread/', count_unread_notifications, name='count-unread-notifications')
]
