import factory

from django.contrib.auth import get_user_model
from django.utils import timezone

from stories.models import (
    Category, Story, SavedStory,
    Comment, Character, IpAddress,
    Episode, Message
)
from authentication.models import (
    Notification
)

User = get_user_model()


class CategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Category

    name = factory.Sequence(lambda n: f'category_{n}')


class IpAddressFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = IpAddress

    ip = factory.Faker('ipv4')


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
        skip_postgeneration_save = True

    username = factory.Sequence(lambda u: f'user_{u}')
    email = factory.LazyAttribute(lambda o: f'{o.username}@example.com')
    password = factory.PostGenerationMethodCall('set_password', 'password')
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    photo = factory.Faker('image_url', width=200, height=200)
    is_active = True
    is_staff = False
    date_joined = factory.Faker('date_time_this_year', tzinfo=timezone.get_current_timezone())


class StoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Story
        skip_postgeneration_save = True

    title = 'Story title'
    description = factory.Faker('text', max_nb_chars=500)
    author = factory.SubFactory(UserFactory)
    category = factory.SubFactory(CategoryFactory)
    image = factory.Faker('image_url', width=200, height=200)
    published = False
    publish_date = None

    @factory.post_generation
    def views(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for view in extracted:
                self.views.add(view)

    @factory.post_generation
    def likes(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for like in extracted:
                self.likes.add(like)


class CommentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Comment
        skip_postgeneration_save = True

    author = factory.SubFactory(UserFactory)
    story = factory.SubFactory(StoryFactory)
    text = factory.Faker('text', max_nb_chars=500)

    @factory.post_generation
    def likes(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for like in extracted:
                self.likes.add(like)


class CharacterFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Character

    name = factory.Sequence(lambda n: f'Character name {n}')
    story = factory.SubFactory(StoryFactory)
    color = factory.Faker('hex_color')


class SavedStoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = SavedStory

    user = factory.SubFactory(UserFactory)
    story = factory.SubFactory(StoryFactory)
    saved_at = factory.LazyFunction(timezone.now)


class NotificationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Notification

    recipient = factory.SubFactory(UserFactory)
    sender = None
    message = 'notification message text'
    is_read = False
    created_at = factory.LazyFunction(timezone.now)


class EpisodeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Episode

    title = factory.Sequence(lambda n: f'Episode title {n}')
    story = factory.SubFactory(StoryFactory)


class MessageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Message

    episode = factory.SubFactory(EpisodeFactory)
    character = factory.SubFactory(CharacterFactory)
    order = factory.Sequence(lambda n: 1024 * n)
    message_type = 'text'
    text_content = factory.Faker('text', max_nb_chars=200)
    image_content = factory.django.ImageField(filename='test_image.jpg')
    video_content = factory.django.FileField(filename='test_video.mp4')
    audio_content = factory.django.FileField(filename='test_audio.mp3')
    status_content = factory.Faker('sentence', nb_words=6)
