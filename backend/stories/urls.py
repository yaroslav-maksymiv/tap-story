from django.urls import path

from .views import (
    CategoryListView
)
from .routers import router

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='categories'),
]

urlpatterns += router.urls
