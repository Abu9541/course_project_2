import { useState } from 'react';
import { getFilteredMovies } from '@services/movieService';
import MovieCard from '@components/MovieCard/MovieCard';
import styles from './HomePage.module.css';
import {Movie} from "@services/types";

const HomePage = () => {
  const [genre, setGenre] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(5.0);
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleSearch = async () => {
    try {
      const data = await getFilteredMovies(genre, minRating);
      setMovies(data);
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className={styles.select}
        >
          <option value="">Все жанры</option>
          <option value="Драма">Драма</option>
          <option value="Комедия">Комедия</option>
        </select>

        <div className={styles.ratingFilter}>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
            className={styles.slider}
          />
          <span>Рейтинг: {minRating.toFixed(1)}+</span>
        </div>

        <button onClick={handleSearch} className={styles.button}>
          Найти
        </button>
      </div>

      <div className={styles.moviesGrid}>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={() => console.log('Selected:', movie.title)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;