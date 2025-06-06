from django.contrib import admin
from .models import Movie
from django.contrib.auth.admin import UserAdmin
from .models import User, Movie


class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('favorite_movies', 'avatar')}),
    )


class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'release_date', 'vote_average')   # Поля для отображения
    search_fields = ('title',)                                 # Добавляем поиск


admin.site.register(User, CustomUserAdmin)
admin.site.register(Movie, MovieAdmin)                         # Регистрируем с кастомным классом
