from rest_framework import serializers
from .models import Movie


class MovieSerializer(serializers.ModelSerializer):
    rating = serializers.FloatField(source='vote_average')  # Добавляем поле rating

    class Meta:
        model = Movie
        fields = '__all__'
