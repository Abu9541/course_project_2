from django.contrib import admin
from .models import Movie


class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'release_date', 'vote_average')   # Поля для отображения
    search_fields = ('title',)                                 # Добавляем поиск


admin.site.register(Movie, MovieAdmin)                         # Регистрируем с кастомным классом
