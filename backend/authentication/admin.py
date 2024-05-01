from django.contrib import admin

from .models import Notification, UserAccount


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    pass


@admin.register(UserAccount)
class UserAccountAdmin(admin.ModelAdmin):
    list_display = ['id', 'username', 'email']
