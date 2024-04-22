from djoser.serializers import UserSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserAccountSerializer(UserSerializer):
    photo = serializers.SerializerMethodField(read_only=True)

    class Meta(UserSerializer.Meta):
        model = User
        fields = [
            'id', 'email', 'username',
            'first_name', 'last_name', 'photo'
        ]

    def get_photo(self, obj):
        if obj.photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.photo.url)
            return obj.photo.url
        return None


class UserAccountCreateSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = User
        fields = [
            'id', 'username', 'email', 'password'
        ]
