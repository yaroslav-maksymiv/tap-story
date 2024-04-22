from rest_framework.routers import DefaultRouter

from .viewsets import (
    StoryViewSet, CharacterViewSet
)

router = DefaultRouter()
router.register('stories', StoryViewSet, basename='stories')
router.register('characters', CharacterViewSet, basename='characters')
