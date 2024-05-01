import pytest

from ..models import (
    Notification
)

pytestmark = pytest.mark.django_db


class TestNotificationModel:
    def test_create(self, notification_factory):
        notification_factory(message='hello')

        assert Notification.objects.count() == 1
        assert Notification.objects.first().message == 'hello'
