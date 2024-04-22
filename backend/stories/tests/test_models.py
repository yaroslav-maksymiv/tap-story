import pytest

pytestmark = pytest.mark.django_db


class TestCategoryModel:
    def test_str_method(self, category_factory):
        category = category_factory()
        assert category.__str__() == 'test_category'
