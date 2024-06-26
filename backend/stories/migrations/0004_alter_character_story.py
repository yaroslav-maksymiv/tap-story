# Generated by Django 5.0.4 on 2024-04-22 19:36

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0003_character_story_story_published'),
    ]

    operations = [
        migrations.AlterField(
            model_name='character',
            name='story',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='characters', to='stories.story'),
        ),
    ]
