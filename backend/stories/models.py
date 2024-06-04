from django.db import models
from django.contrib.auth import get_user_model

from .validators import validate_hex_color

User = get_user_model()


class Timestamp(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class IpAddress(models.Model):
    ip = models.CharField(max_length=255)

    def __str__(self):
        return self.ip


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Story(Timestamp):
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=5000)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stories')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='stories')
    image = models.ImageField(upload_to='story_images', blank=True, null=True)
    likes = models.ManyToManyField(User, related_name='stories_liked', null=True, blank=True)
    views = models.ManyToManyField(IpAddress, blank=True, null=True)
    published = models.BooleanField(default=False)
    publish_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def get_count_views(self):
        return self.views.count()

    def get_count_likes(self):
        return self.likes.count()

    def get_count_comments(self):
        return self.comments.count()

    def __str__(self):
        return self.title


class Comment(Timestamp):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    story = models.ForeignKey(Story, related_name='comments', on_delete=models.CASCADE)
    text = models.TextField(max_length=2000)
    likes = models.ManyToManyField(User, related_name='comment_like')

    class Meta:
        ordering = ['-created_at']

    def get_count_likes(self):
        return self.likes.count()

    def __str__(self):
        return f'{self.author.username} - {self.story}'


class SavedStory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    story = models.ForeignKey(Story, on_delete=models.CASCADE)
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'story']
        ordering = ['-saved_at']

    def __str__(self):
        return f'{self.user.username}\'s saved story: {self.story.title}'


class Episode(Timestamp):
    title = models.CharField(max_length=255)
    story = models.ForeignKey(Story, related_name='episodes', on_delete=models.CASCADE)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f'Episode {self.story}: {self.title}'


class Character(models.Model):
    name = models.CharField(max_length=50)
    story = models.ForeignKey(Story, related_name='characters', on_delete=models.CASCADE)
    color = models.CharField(max_length=7, validators=[validate_hex_color])

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.color = self.color.upper()
        validate_hex_color(self.color)
        super().save(*args, **kwargs)


class Message(Timestamp):
    MESSAGE_TYPES = (
        ('text', 'Text'),
        ('image', 'Image'),
        ('video', 'Video'),
        ('audio', 'Audio'),
        ('status', 'Status'),
    )

    episode = models.ForeignKey(Episode, related_name='messages', on_delete=models.CASCADE)
    character = models.ForeignKey(Character, related_name='messages', on_delete=models.SET_NULL, null=True, blank=True)
    order = models.FloatField(unique=True)
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPES, default='text')

    text_content = models.TextField(max_length=200, blank=True, default='')
    image_content = models.ImageField(upload_to='message_images', blank=True, null=True)
    video_content = models.FileField(upload_to='message_videos', blank=True, null=True)
    audio_content = models.FileField(upload_to='message_audios', blank=True, null=True)
    status_content = models.CharField(max_length=255, blank=True, default='')

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.character.name if self.character else "AUTHOR"} - {self.message_type}'
