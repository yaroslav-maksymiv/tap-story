import pytest

from ..models import (
    Category, Story, IpAddress,
    Comment, SavedStory, Character,
    Episode, Message
)

pytestmark = pytest.mark.django_db


def user_can_only_like_once_test(factory_function, user_factory_function):
    user = user_factory_function(username='usr', email='email@email.com')
    instance = factory_function(likes=[user, user])
    assert instance.likes.count() == 1


def count_likes_test(factory_function, user_factory_function):
    user1 = user_factory_function(username='usr1', email='email1@email.com')
    user2 = user_factory_function(username='usr2', email='email2@email.com')
    user3 = user_factory_function(username='usr3', email='email3@email.com')
    instance = factory_function(likes=[user1, user2, user3])

    assert instance.likes.count() == 3


class TestCategoryModel:
    def test_unique_name(self, category_factory):
        name = "Unique Category"
        category_factory(name=name)

        with pytest.raises(Exception):
            category_factory(name=name)

    def test_non_unique_name(self, category_factory):
        category_factory(name="Category 1")
        category_factory(name="Category 2")

        assert Category.objects.count() == 2


class TestApiAddress:
    def test_create(self, ip_address_factory):
        ip_address = ip_address_factory()

        assert IpAddress.objects.count() == 1
        assert ip_address.ip is not None


class TestStoryModel:
    def test_create(self, story_factory):
        story = story_factory(title='Test Story')

        assert Story.objects.count() == 1
        assert story.title.startswith('Test Story')
        assert len(story.description) <= 500
        assert story.image is not None
        assert story.author is not None
        assert story.category is not None

    def test_adding_views(self, story_factory, ip_address_factory):
        ip_address = ip_address_factory()
        story = story_factory(views=[ip_address])

        assert story.views.count() == 1
        assert ip_address in story.views.all()

    def test_count_likes(self, story_factory, user_factory):
        count_likes_test(story_factory, user_factory)

    def test_user_can_only_like_once(self, story_factory, user_factory):
        user_can_only_like_once_test(story_factory, user_factory)


class TestComment:
    def test_create(self, comment_factory, user_factory, story_factory):
        user = user_factory()
        story = story_factory()
        comment = comment_factory(author=user, story=story)

        assert Comment.objects.count() == 1
        assert len(comment.text) <= 500
        assert comment.author == user
        assert comment.story == story

    def test_count_likes(self, comment_factory, user_factory):
        count_likes_test(comment_factory, user_factory)

    def test_user_can_only_like_once(self, comment_factory, user_factory):
        user_can_only_like_once_test(comment_factory, user_factory)


class TestSavedStory:
    def test_create(self, user_factory, story_factory, saved_story_factory):
        user = user_factory()
        story = story_factory()
        saved_story = saved_story_factory(user=user, story=story)

        assert SavedStory.objects.count() == 1
        assert saved_story.story.pk == story.pk
        assert saved_story.user == user


class TestCharacter:
    def test_create(self, story_factory, character_factory):
        story = story_factory()
        character_factory.create_batch(5, story=story)

        assert Character.objects.count() == 5
        assert Character.objects.first().story == story


class TestEpisode:
    def test_create(self, story_factory, episode_factory):
        story = story_factory()
        episode = episode_factory(title='Episode title', story=story)

        assert Episode.objects.count() == 1
        assert episode.title.startswith('Episode')


class TestMessage:
    def test_create(self, episode_factory, character_factory, message_factory):
        episode = episode_factory()
        character = character_factory()
        message = message_factory(
            episode=episode,
            character=character,
            order=1024,
            message_type='text',
            text_content='Some text'
        )

        assert Message.objects.count() == 1
        assert message.episode == episode
        assert message.character == character
        assert message.order == 1024
        assert message.message_type == 'text'
        assert message.text_content == 'Some text'

    def test_set_null_character_on_delete(self, character_factory, message_factory):
        character = character_factory()
        message = message_factory(character=character)

        assert message.character == character
        character.delete()
        message.refresh_from_db()
        assert message.character is None
