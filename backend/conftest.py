import pytest
from pytest_factoryboy import register
from rest_framework.test import APIClient
from django.shortcuts import reverse

from factories import (
    CategoryFactory, StoryFactory, UserFactory,
    IpAddressFactory, CommentFactory, CharacterFactory,
    SavedStoryFactory, NotificationFactory, EpisodeFactory,
    MessageFactory
)

register(CategoryFactory)
register(StoryFactory)
register(UserFactory)
register(IpAddressFactory)
register(CommentFactory)
register(CharacterFactory)
register(SavedStoryFactory)
register(NotificationFactory)
register(EpisodeFactory)
register(MessageFactory)


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def get_jwt_token(user_factory, api_client):
    def _get_jwt_token(current_user=None):
        url = reverse('jwt-create')
        password = 'password123'

        if current_user:
            user = current_user
        else:
            user = user_factory()

        user.set_password(password)
        user.save()

        data = {'email': user.email, 'password': password}
        response = api_client.post(url, data, format='json')
        assert response.status_code == 200
        return response.data['access']

    return _get_jwt_token


