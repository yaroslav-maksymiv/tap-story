from djoser.serializers import UserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class UserAccountSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = User
        fields = [
            'id', 'email', 'username',
            'first_name', 'last_name', 'photo'
        ]


class UserAccountCreateSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = User
        fields = [
            'id', 'username', 'email', 'password'
        ]
