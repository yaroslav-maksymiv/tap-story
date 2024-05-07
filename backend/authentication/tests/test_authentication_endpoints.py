import json
import pytest
from django.shortcuts import reverse

pytestmark = pytest.mark.django_db


class TestNotificationEndpoints:
    def test_list_get(self, notification_factory, user_factory, get_jwt_token, api_client):
        url = reverse('notifications')
        recipient = user_factory()
        token = get_jwt_token(current_user=recipient)
        message = f'hello {recipient.username}'
        notification_factory(recipient=recipient, message=message)
        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')

        response = api_client.get(url, format='json')
        assert response.status_code == 200
        assert len(json.loads(response.content).get('results')) == 1
