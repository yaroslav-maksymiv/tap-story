import pytest
import json

from django.urls import reverse

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

