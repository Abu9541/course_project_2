import { useState, useEffect } from 'react';
import { getFilteredMovies, getMovies } from '@services/movieService'; // Импортируем getMovies
import MovieCard from '@components/MovieCard/MovieCard';
import { FiltersPanel } from '@components/FiltersPanel/FiltersPanel';
import { AuthModal } from '@components/AuthModal/AuthModal';
import { withAuth } from '@hocs/withAuth';
import styles from './HomePage.module.css';
import { Movie } from '@services/types';
import { MovieDetails} from "@components/MovieDetails/MovieDetails";
import { AnimatePresence } from 'framer-motion';

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
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchTitle, setSearchTitle] = useState('');

  // Загружаем список фильмов и жанров при монтировании
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Загружаем все фильмы
        const moviesResponse = await getMovies();
        setMovies(moviesResponse);

        // Загружаем уникальные жанры
        const allGenres = moviesResponse.flatMap((movie: Movie) => movie.genres);
        setAvailableGenres(Array.from(new Set(allGenres)));
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    fetchInitialData();
  }, []);

  const handleApplyFilters = async (filters: {
  genres: string[];
  minRating: number;
  year?: string
}) => {
  try {
    const params = new URLSearchParams();
    // Для каждого жанра добавляем отдельный параметр genre
    filters.genres.forEach(g => params.append('genre', g));
    params.append('min_rating', filters.minRating.toString());
    if (filters.year) params.append('year', filters.year);
    if (searchTitle) params.append('title', searchTitle);

    const data = await getFilteredMovies(params.toString());
    setMovies(data);
  } catch (error) {
    console.error('Ошибка фильтрации:', error);
  }
};

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTitle) params.append('title', searchTitle);
      const data = await getFilteredMovies(params.toString());
      setMovies(data);
    } catch (error) {
      console.error('Ошибка поиска:', error);
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
                <ProtectedContent/>
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
        <div className={styles.searchContainer}>
          <input
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              placeholder="Поиск по названию фильма"
              className={styles.searchInput}
          />
          <button onClick={handleSearch} className={styles.searchButton}>
            Найти
          </button>
        </div>
        <div className={styles.moviesGrid}>
          <AnimatePresence mode="wait">
            {movies.map((movie) => (
                <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={() => setSelectedMovie(movie)}
                />
            ))}
          </AnimatePresence>
        </div>

        {selectedMovie && (
            <MovieDetails
                movie={selectedMovie}
                onClose={() => setSelectedMovie(null)}
            />
        )}

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