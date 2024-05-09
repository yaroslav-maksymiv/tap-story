# Generated by Django 5.0.4 on 2024-05-09 23:03

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0009_ipaddress_alter_comment_options_alter_story_options_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='savedstory',
            options={'ordering': ['-saved_at']},
        ),
        migrations.RemoveField(
            model_name='episode',
            name='order',
        ),
        migrations.AlterField(
            model_name='story',
            name='likes',
            field=models.ManyToManyField(blank=True, null=True, related_name='stories_liked', to=settings.AUTH_USER_MODEL),
        ),
    ]
