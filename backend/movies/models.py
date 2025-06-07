from django.contrib.auth.models import AbstractUser
from django.db import models


class Movie(models.Model):
    tmdb_id = models.IntegerField(unique=True)
    title = models.CharField(max_length=200)
    overview = models.TextField()
    poster_path = models.CharField(max_length=200, null=True, blank=True)
    release_date = models.CharField(max_length=10)
    vote_average = models.FloatField(verbose_name="Rating")
    genres = models.JSONField(default=list)
    backdrop_path = models.CharField(max_length=200, null=True, blank=True)
    runtime = models.IntegerField(null=True, blank=True)
    vote_count = models.IntegerField(default=0)
    original_language = models.CharField(max_length=10, null=True, blank=True)
    age_rating = models.CharField(max_length=10, null=True, blank=True)


    @property
    def rating(self):
        return self.vote_average

    class Meta:
        db_table = 'movies_movie'

    def __str__(self):
        return self.title


class User(AbstractUser):
    favorite_movies = models.ManyToManyField('Movie', blank=True)
    avatar = models.URLField(null=True, blank=True)
