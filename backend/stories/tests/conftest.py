import pytest
from pytest_factoryboy import register
from rest_framework.test import APIClient

from .factories import (
    CategoryFactory, StoryFactory, UserFactory,
    IpAddressFactory, CommentFactory
)

register(CategoryFactory)
register(StoryFactory)
register(UserFactory)
register(IpAddressFactory)
register(CommentFactory)


@pytest.fixture
def api_client():
    return APIClient
