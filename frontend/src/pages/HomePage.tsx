import { useState, useEffect } from 'react';
import { getFilteredMovies } from '@services/movieService';
import MovieCard from '@components/MovieCard/MovieCard';
import { FiltersPanel } from '@components/FiltersPanel/FiltersPanel';
import { AuthModal } from '@components/AuthModal/AuthModal';
import { withAuth } from '@hocs/withAuth';
import api from '@services/api';
import styles from './HomePage.module.css';
import { Movie } from '@services/types';

const ProtectedContent = withAuth(({ user }) => {
  return (
    <div className={styles.userPanel}>
      <span>Добро пожаловать, {user.username}!</span>
    </div>
  );
});

const HomePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);

  // Загружаем список уникальных жанров при монтировании
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get('/api/movies/');
        const allGenres = response.data.flatMap((movie: Movie) => movie.genres);
        setAvailableGenres(Array.from(new Set(allGenres))); // Исправлено здесь
      } catch (error) {
        console.error('Ошибка загрузки жанров:', error);
      }
    };

    fetchGenres();
  }, []);

  const handleApplyFilters = async (filters: {
  genres: string[];
  minRating: number;
  year?: string
}) => {
  try {
    const params = new URLSearchParams();
    filters.genres.forEach(g => params.append('genre', g));
    params.append('min_rating', filters.minRating.toString());
    if (filters.year) params.append('year', filters.year);

    const data = await getFilteredMovies(params.toString());
    setMovies(data);
  } catch (error) {
    console.error('Ошибка фильтрации:', error);
  }
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const openLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const openRegister = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  return (
    <div className={styles.container}>
      <FiltersPanel
        onApply={handleApplyFilters}
        availableGenres={availableGenres}
      />

      <div className={styles.content}>
        <header className={styles.header}>
          {localStorage.getItem('token') ? (
            <div className={styles.authSection}>
              <ProtectedContent />
              <button onClick={handleLogout} className={styles.authButtonClose}>
                Выйти
              </button>
            </div>
          ) : (
            <div className={styles.authSection}>
              <span className={styles.userPanel}>Уже есть аккаунт? </span>
              <button onClick={openLogin} className={styles.authButton}>
                Войдите
              </button>
              <span className={styles.userPanel}>Ещё нет? Тогда самое время</span>
              <button onClick={openRegister} className={styles.authButton}>
                Зарегистрироваться
              </button>
            </div>
          )}
        </header>

        <div className={styles.moviesGrid}>
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => console.log('Selected:', movie.title)}
            />
          ))}
        </div>

        {movies.length === 0 && (
          <div className={styles.noResults}>
            Фильмы не найдены. Измените параметры фильтрации.
          </div>
        )}
      </div>

      {showAuthModal && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
};

export default HomePage;