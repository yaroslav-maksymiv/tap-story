from pytest_factoryboy import register

from .factories import (
    CategoryFactory, StoryFactory, UserFactory,
    IpAddressFactory, CommentFactory
)

register(CategoryFactory)
register(StoryFactory)
register(UserFactory)
register(IpAddressFactory)
register(CommentFactory)
