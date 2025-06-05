from rest_framework import generics, viewsets
from .models import Movie
from .serializers import MovieSerializer
from rest_framework.decorators import action
from rest_framework.response import Response


class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

    @action(detail=False, methods=['GET'])
    def filtered(self, request):
        genre = request.query_params.get('genre', '').lower().strip()
        min_rating = float(request.query_params.get('min_rating', 0))

        queryset = self.get_queryset()

        # Добавим логирование
        print(f"Получены параметры: genre='{genre}', min_rating={min_rating}")
        print(f"Всего фильмов до фильтрации: {queryset.count()}")

        if genre:
            queryset = [m for m in queryset if genre in [g.lower() for g in m.genres]]

        queryset = [m for m in queryset if m.vote_average >= min_rating]

        print(f"Найдено после фильтрации: {len(queryset)}")
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
