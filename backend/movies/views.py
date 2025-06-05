from rest_framework import generics, viewsets
from .models import Movie
from .serializers import MovieSerializer
from rest_framework.decorators import action
from rest_framework.response import Response


class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

    @action(detail=False, methods=['get'], url_path='filter')  # Явно указываем url_path
    def filtered(self, request):
        print("Фильтрация работает!")  # Для отладки
        genre = request.query_params.get('genre', '').lower()
        min_rating = float(request.query_params.get('min_rating', 0))

        queryset = self.get_queryset()

        if genre:
            queryset = [m for m in queryset if genre in [g.lower() for g in m.genres]]

        queryset = [m for m in queryset if m.vote_average >= min_rating]

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
