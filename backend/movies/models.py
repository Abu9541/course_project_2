from django.db import models


class Movie(models.Model):
    tmdb_id = models.IntegerField(unique=True)
    title = models.CharField(max_length=200)
    overview = models.TextField()
    poster_path = models.CharField(max_length=200, null=True, blank=True)
    release_date = models.CharField(max_length=10)  # Формат: "YYYY-MM-DD"
    vote_average = models.FloatField(verbose_name="Rating")  # Основное поле для рейтинга
    genres = models.JSONField(default=list)  # Пример: ["Драма", "Криминал"]

    # Добавляем свойство для совместимости (если нужно обращаться как movie.rating)
    @property
    def rating(self):
        return self.vote_average

    class Meta:
        db_table = 'movies_movie'

    def __str__(self):
        return self.title
