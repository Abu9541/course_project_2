import requests
from django.conf import settings
from .models import Movie


def get_age_rating(movie_id):
    try:
        release_url = f"https://api.themoviedb.org/3/movie/{movie_id}/release_dates?api_key={settings.TMDB_API_KEY}"
        response = requests.get(release_url)
        data = response.json()

        # Ищем российский рейтинг (RU) или американский (US) в качестве fallback
        for country in data.get('results', []):
            if country['iso_3166_1'] == 'RU':
                for release in country.get('release_dates', []):
                    if release['certification']:
                        return release['certification']
            elif country['iso_3166_1'] == 'US':
                for release in country.get('release_dates', []):
                    if release['certification']:
                        return release['certification']
        return None
    except Exception as e:
        print(f"Ошибка при получении возрастного рейтинга для фильма {movie_id}: {e}")
        return None


def fetch_popular_movies():
    # Проверка существования таблицы
    from django.db import connection
    if 'movies_movie' not in connection.introspection.table_names():
        raise Exception("Таблица movies_movie не существует. Выполните миграции!")
    # 1. Получаем список всех жанров из TMDB
    genres_url = f"https://api.themoviedb.org/3/genre/movie/list?api_key={settings.TMDB_API_KEY}&language=ru-RU"
    genres_response = requests.get(genres_url)
    genres_data = genres_response.json()
    genre_dict = {g['id']: g['name'] for g in genres_data['genres']}

    # 2. Получаем популярные фильмы
    movies_url = f"https://api.themoviedb.org/3/movie/popular?api_key={settings.TMDB_API_KEY}&language=ru-RU&page=4"

    try:
        movies_response = requests.get(movies_url)
        movies_response.raise_for_status()
        movies_data = movies_response.json()
    except Exception as e:
        print(f"Ошибка при получении фильмов: {e}")
        return

    # 3. Для каждого фильма получаем полную информацию (чтобы получить жанры)
    for movie_data in movies_data['results']:
        try:
            # Получаем детальную информацию о фильме
            movie_detail_url = f"https://api.themoviedb.org/3/movie/{movie_data['id']}?api_key={settings.TMDB_API_KEY}&language=ru-RU"
            detail_response = requests.get(movie_detail_url)
            detail_data = detail_response.json()

            # Преобразуем жанры в список названий
            genres = [genre_dict[g['id']] for g in detail_data.get('genres', [])]

            # Создаем или обновляем фильм
            Movie.objects.update_or_create(
                tmdb_id=movie_data['id'],
                release_date=detail_data.get('release_date'),
                defaults={
                    'title': movie_data['title'],
                    'overview': movie_data['overview'],
                    'poster_path': f"https://image.tmdb.org/t/p/w500{movie_data['poster_path']}" if movie_data[
                        'poster_path'] else None,
                    'backdrop_path': f"https://image.tmdb.org/t/p/original{movie_data['backdrop_path']}" if movie_data[
                        'backdrop_path'] else None,
                    'runtime': detail_data.get('runtime'),
                    'vote_average': movie_data['vote_average'],
                    'vote_count': movie_data['vote_count'],
                    'original_language': detail_data.get('original_language'),
                    'genres': genres,
                    'age_rating': get_age_rating(movie_data['id'])
                }
            )

        except Exception as e:
            print(f"Ошибка при обработке фильма {movie_data['title']}: {e}")
            continue

    print(f"Успешно обновлено {len(movies_data['results'])} фильмов!")
