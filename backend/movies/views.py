from rest_framework import generics, viewsets, status
from .models import Movie
from .serializers import MovieSerializer, UserSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model, authenticate
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny


class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

    @action(detail=False, methods=['get'], url_path='filter')  # Явно указываем url_path
    def filtered(self, request):
        print("Фильтрация работает!")  # Для отладки
        year = request.query_params.get('year')
        genre = request.query_params.get('genre', '').lower()
        min_rating = float(request.query_params.get('min_rating', 0))
        genres = request.query_params.getlist('genre')
        title = request.query_params.get('title')

        queryset = self.get_queryset()

        if genres:
            queryset = [m for m in queryset if all(
                g.lower() in [mg.lower() for mg in m.genres]
                for g in genres
            )]

        if year:
            queryset = [m for m in queryset if year in m.release_date]

        if title:
            queryset = [m for m in queryset if title.lower() in m.title.lower()]

        queryset = [m for m in queryset if m.vote_average >= min_rating]

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.id,
                'username': user.username
            }, status=status.HTTP_200_OK)

        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAIZED
        )


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            user = User.objects.get(username=request.data['username'])
            response.data['user_id'] = user.id
            response.data['username'] = user.username
        return response


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=400)

        user = User.objects.create_user(username=username, password=password)
        return Response({'success': True, 'user_id': user.id}, status=201)
