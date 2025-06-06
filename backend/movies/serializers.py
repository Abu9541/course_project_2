from rest_framework import serializers
from .models import Movie
from django.contrib.auth import get_user_model


class MovieSerializer(serializers.ModelSerializer):
    rating = serializers.FloatField(source='vote_average')  # Добавляем поле rating

    class Meta:
        model = Movie
        fields = '__all__'


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'favorite_movies')
