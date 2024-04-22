from django.contrib import admin

from .models import *


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    fields = ['name']
    list_display = ['id', 'name']


@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'author']


@admin.register(Character)
class CharacterAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'story']

