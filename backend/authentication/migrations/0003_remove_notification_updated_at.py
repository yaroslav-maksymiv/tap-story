# Generated by Django 5.0.4 on 2024-04-19 22:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_notification'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notification',
            name='updated_at',
        ),
    ]
