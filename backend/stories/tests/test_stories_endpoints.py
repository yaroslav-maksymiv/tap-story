import pytest
import json

from django.urls import reverse

from ..models import SavedStory

pytestmark = pytest.mark.django_db


class TestCategoryEndpoints:
    url = reverse('categories')

    def test_categories_get(self, category_factory, api_client):
        category_factory.create_batch(4)
        response = api_client.get(self.url)

        assert response.status_code == 200
        assert len(json.loads(response.content)) == 4


class TestCommentEndpoints:
    def test_create(self, story_factory, user_factory, get_jwt_token, api_client):
        url = reverse('comments-list')
        author = user_factory()
        token = get_jwt_token(current_user=author)
        story = story_factory()
        text = 'new comment'
        data = {
            'author': author.id,
            'story': story.id,
            'text': text
        }
        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')

        response = api_client.post(url, data=data, format='json')
        response_data = json.loads(response.content)
        assert response.status_code == 201
        assert response_data.get('text') == text
        assert int(response_data.get('author').get('id')) == author.id

    def test_delete(self, user_factory, comment_factory, get_jwt_token, api_client):
        author = user_factory()
        comment = comment_factory(author=author)
        token = get_jwt_token(current_user=author)
        url = reverse('comments-detail', args=[comment.pk])
        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')

        response = api_client.delete(url)
        assert response.status_code == 204

    def test_update(self, comment_factory, user_factory, get_jwt_token, api_client):
        author = user_factory()
        token = get_jwt_token(current_user=author)
        comment = comment_factory(author=author, text='update comment')
        url = reverse('comments-detail', args=[comment.pk])
        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')
        new_text = 'new update comment text'
        data = {
            'text': new_text
        }

        response = api_client.patch(url, data=data, format='json')
        response_data = json.loads(response.content)
        assert response.status_code == 200
        assert response_data.get('text') == new_text

    def test_toggle_like(self, user_factory, comment_factory, get_jwt_token, api_client):
        user = user_factory()
        comment = comment_factory()
        token = get_jwt_token(current_user=user)
        url = reverse('comments-toggle-like', args=[comment.pk])
        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')

        response = api_client.post(url, format='json')
        data = json.loads(response.content)
        assert response.status_code == 200
        assert data.get('liked') == True

        response = api_client.post(url, format='json')
        data = json.loads(response.content)
        assert response.status_code == 200
        assert data.get('liked') == False


class TestStoryEndpoints:
    def test_stories_get(self, story_factory, api_client):
        url = reverse('stories-list')
        story_factory.create_batch(4)
        response = api_client.get(url)

        assert response.status_code == 200
        assert int(json.loads(response.content).get('total', 0)) == 4

    def test_retrieve(self, story_factory, api_client):
        story = story_factory()
        url = reverse('stories-detail', args=[story.pk])

        response = api_client.get(url)
        data = json.loads(response.content)
        assert response.status_code == 200
        assert int(data.get('views', 0)) == 1

    def test_create(self, get_jwt_token, category_factory, api_client):
        url = reverse('stories-list')
        category = category_factory()
        data = {
            'title': 'Test Story',
            'description': 'This is a test story.',
            'category': category.id
        }
        token = get_jwt_token()
        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')

        response = api_client.post(url, data=data, format='json')
        assert response.status_code == 201

    def test_update(self, get_jwt_token, story_factory, user_factory, category_factory, api_client):
        author = user_factory()
        category = category_factory()
        story = story_factory(author=author)
        url = reverse('stories-detail', args=[story.pk])
        token = get_jwt_token(current_user=author)
        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')
        description = 'my_new_description'
        data = {
            'title': story.title,
            'description': 'my_new_description',
            'category': category.id
        }

        response = api_client.put(url, data=data, format='json')
        response_data = json.loads(response.content)
        assert response.status_code == 200
        assert response_data.get('description') == description

    def test_update_not_author(self, get_jwt_token, story_factory, user_factory, category_factory, api_client):
        author = user_factory()
        another_user = user_factory()
        category = category_factory()
        story = story_factory(author=author)
        url = reverse('stories-detail', args=[story.pk])
        token = get_jwt_token(current_user=another_user)
        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')
        data = {
            'title': story.title,
            'description': story.description,
            'category': category.id
        }

        response = api_client.put(url, data=data, format='json')
        assert response.status_code == 403

    def test_publish_story(self, get_jwt_token, story_factory, user_factory, api_client):
        author = user_factory()
        token = get_jwt_token(current_user=author)
        story = story_factory(author=author)
        url = reverse('stories-publish', args=[story.pk])
        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')

        response = api_client.post(url, format='json')
        assert response.status_code == 200
        story.refresh_from_db()
        assert story.published == True
        assert story.publish_date is not None

    def test_get_comments(self, story_factory, comment_factory, api_client):
        story = story_factory()
        comment_factory(story=story)
        url = reverse('stories-comments', args=[story.pk])

        response = api_client.get(url, format='json')
        data = json.loads(response.content)
        assert response.status_code == 200
        assert len(data.get('results')) == 1

    def test_get_characters(self, story_factory, character_factory, user_factory, get_jwt_token, api_client):
        author = user_factory()
        token = get_jwt_token(current_user=author)
        story = story_factory(author=author)
        character_factory(story=story)
        url = reverse('stories-characters', args=[story.pk])
        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')

        response = api_client.get(url, format='json')
        assert response.status_code == 200
        assert len(json.loads(response.content)) == 1

    def test_toggle_like_story(self, user_factory, story_factory, get_jwt_token, api_client):
        user = user_factory()
        story = story_factory()
        token = get_jwt_token(current_user=user)
        url = reverse('stories-toggle-like', args=[story.pk])
        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')

        response = api_client.post(url, format='json')
        data = json.loads(response.content)
        assert response.status_code == 200
        assert data.get('liked') == True

        response = api_client.post(url, format='json')
        data = json.loads(response.content)
        assert response.status_code == 200
        assert data.get('liked') == False

    def test_liked_stories(self, user_factory, story_factory, get_jwt_token, api_client):
        user = user_factory()
        story = story_factory()
        token = get_jwt_token(current_user=user)
        url_toggle_like = reverse('stories-toggle-like', args=[story.pk])
        url_liked_stories = reverse('stories-liked')
        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')

        response_toggle_like = api_client.post(url_toggle_like, format='json')
        assert response_toggle_like.status_code == 200

        response = api_client.get(url_liked_stories, format='json')
        data = json.loads(response.content)
        assert response.status_code == 200
        assert len(data.get('results')) == 1
        assert data.get('results')[0].get('id') == story.pk


class TestSavedStoryViewSet:
    def test_create_saved_story(self, user_factory, story_factory, get_jwt_token, api_client):
        user = user_factory()
        token = get_jwt_token(current_user=user)
        story = story_factory()
        url = reverse('saved-stories-list')
        data = {'story': story.id}
        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')

        response = api_client.post(url, data=data, format='json')

        assert response.status_code == 201
        assert SavedStory.objects.filter(user=user, story=story).exists()

    def test_list_saved_stories(self, user_factory, saved_story_factory, get_jwt_token, api_client):
        user = user_factory()
        saved_stories = saved_story_factory.create_batch(3, user=user)
        token = get_jwt_token(current_user=user)
        url = reverse('saved-stories-list')
        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')

        response = api_client.get(url)
        data = json.loads(response.content)
        assert response.status_code == 200
        assert len(data.get('results')) == 3

    def test_empty_list_saved_stories(self, user_factory, saved_story_factory, get_jwt_token, api_client):
        user = user_factory()
        token = get_jwt_token(current_user=user)
        url = reverse('saved-stories-list')
        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')

        response = api_client.get(url)
        data = json.loads(response.content)
        assert response.status_code == 200
        assert len(data.get('results')) == 0

    def test_delete_saved_story(self, user_factory, saved_story_factory, get_jwt_token, api_client):
        user = user_factory()
        saved_story = saved_story_factory(user=user)
        token = get_jwt_token(current_user=user)
        url = reverse('saved-stories-detail', args=[saved_story.pk])
        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')

        response = api_client.delete(url)

        assert response.status_code == 204
        assert not SavedStory.objects.filter(pk=saved_story.pk).exists()

    def test_delete_saved_story_forbidden(self, user_factory, saved_story_factory, get_jwt_token, story_factory, api_client):
        user = user_factory()
        other_user = user_factory()
        story = story_factory()
        saved_story = saved_story_factory(user=other_user, story=story)
        token = get_jwt_token(current_user=user)
        url = reverse('saved-stories-delete')
        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')
        data = {'story': saved_story.story.pk}

        response = api_client.delete(url, data=data)

        assert response.status_code == 403
        assert SavedStory.objects.filter(pk=saved_story.pk).exists()


class TestCharacterEndpoints:
    def test_create(self, story_factory, user_factory, get_jwt_token, api_client):
        name = 'New Character'
        user = user_factory()
        story = story_factory(author=user)
        token = get_jwt_token(current_user=user)
        url = reverse('characters-list')
        data = {'name': name, 'story': story.pk}

        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')
        response = api_client.post(url, data=data, format='json')

        assert response.status_code == 201
        response_data = json.loads(response.content)
        assert response_data.get('id') == 1
        assert response_data.get('name') == name
        assert response_data.get('story') == story.pk

    def test_update(self, character_factory, user_factory, get_jwt_token, api_client):
        user = user_factory()
        character = character_factory(name='Original Name', story__author=user)
        token = get_jwt_token(current_user=user)
        url = reverse('characters-detail', args=[character.pk])
        new_name = 'Updated Name'
        data = {'name': new_name}

        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')
        response = api_client.patch(url, data=data, format='json')

        assert response.status_code == 200
        assert response.data['name'] == new_name

    def test_delete(self, character_factory, user_factory, get_jwt_token, api_client):
        user = user_factory()
        character = character_factory(story__author=user)
        token = get_jwt_token(current_user=user)
        url = reverse('characters-detail', args=[character.pk])

        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')
        response = api_client.delete(url)

        assert response.status_code == 204


class TestEpisodeViewSet:
    def test_create(self, user_factory, story_factory, get_jwt_token, api_client):
        user = user_factory()
        token = get_jwt_token(current_user=user)
        story = story_factory(author=user)
        url = reverse('episodes-list')
        data = {'title': 'New Episode', 'story': story.pk}

        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')
        response = api_client.post(url, data=data, format='json')

        assert response.status_code == 201
        assert response.data['title'] == 'New Episode'
        assert response.data['story'] == story.pk

    def test_update(self, user_factory, episode_factory, get_jwt_token, api_client):
        user = user_factory()
        token = get_jwt_token(current_user=user)
        episode = episode_factory(story__author=user)
        url = reverse('episodes-detail', args=[episode.pk])
        updated_title = 'Updated Episode Title'
        data = {'title': updated_title}

        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')
        response = api_client.patch(url, data=data, format='json')

        assert response.status_code == 200
        assert response.data['title'] == updated_title

    def test_destroy(self, user_factory, episode_factory, get_jwt_token, api_client):
        user = user_factory()
        token = get_jwt_token(current_user=user)
        episode = episode_factory(story__author=user)
        url = reverse('episodes-detail', args=[episode.pk])

        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')
        response = api_client.delete(url)

        assert response.status_code == 204

    @pytest.mark.skip
    def test_get_messages(self, episode_factory, message_factory, api_client):
        episode = episode_factory()
        message_factory.create_batch(5, episode=episode)
        url = reverse('episodes-messages', args=[episode.pk])

        response = api_client.get(url)

        assert response.status_code == 200
        assert len(response.data) == 5


class TestMessageEndpoints:
    def test_create(self, user_factory, episode_factory, character_factory, get_jwt_token, api_client):
        user = user_factory()
        token = get_jwt_token(current_user=user)
        episode = episode_factory(story__author=user)
        character = character_factory()
        url = reverse('messages-list')
        data = {
            'episode': episode.pk,
            'order': 1024,
            'character': character.pk,
            'message_type': 'text',
            'text_content': 'Test message content'
        }

        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')
        response = api_client.post(url, data=data, format='json')

        assert response.status_code == 201
        assert response.data['text_content'] == 'Test message content'

    def test_update(self, user_factory, message_factory, get_jwt_token, api_client):
        user = user_factory()
        token = get_jwt_token(current_user=user)
        message = message_factory(episode__story__author=user)
        url = reverse('messages-detail', args=[message.pk])
        updated_content = 'Updated message content'
        data = {'text_content': updated_content}

        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')
        response = api_client.patch(url, data=data, format='json')

        assert response.status_code == 200
        assert response.data['text_content'] == updated_content

    def test_destroy(self, user_factory, message_factory, get_jwt_token, api_client):
        user = user_factory()
        token = get_jwt_token(current_user=user)
        message = message_factory(episode__story__author=user)
        url = reverse('messages-detail', args=[message.pk])

        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')
        response = api_client.delete(url)

        assert response.status_code == 204

    def test_update_order(self, user_factory, message_factory, get_jwt_token, api_client):
        user = user_factory()
        token = get_jwt_token(current_user=user)
        message = message_factory(episode__story__author=user)
        url = reverse('messages-order', args=[message.pk])
        new_order = 100
        data = {'order': new_order}

        api_client.credentials(HTTP_AUTHORIZATION=f'JWT {token}')
        response = api_client.patch(url, data=data, format='json')

        assert response.status_code == 200
        message.refresh_from_db()
        assert message.order == new_order
