from django.core.management.base import BaseCommand
from movies.tmdb import fetch_popular_movies


class Command(BaseCommand):
    help = 'Fetch popular movies from TMDB'

    def handle(self, *args, **options):
        fetch_popular_movies()
        self.stdout.write("Фильмы успешно загружены!")
