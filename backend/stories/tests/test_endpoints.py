import pytest
import json

from django.urls import reverse

pytestmark = pytest.mark.django_db


class TestCategoryEndpoints:
    url = reverse('categories')

    def test_categories_get(self, category_factory, api_client):
        category_factory.create_batch(4)
        response = api_client().get(self.url)

        assert response.status_code == 200
        assert len(json.loads(response.content)) == 4
