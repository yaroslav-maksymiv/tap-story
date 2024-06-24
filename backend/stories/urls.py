from django.urls import path

from .views import (
    CategoryListView,
    UpdateUserStoryStatusView
)
from .routers import router

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='categories'),
    path('update-status/', UpdateUserStoryStatusView.as_view(), name='update-story-status')
]

urlpatterns += router.urls
