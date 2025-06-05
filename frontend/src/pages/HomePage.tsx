import { useState } from 'react';
import api from "../services/api";

const HomePage = () => {
  const [genre, setGenre] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(7.0);
  const [movies, setMovies] = useState<any[]>([]);

const handleSearch = async () => {
  try {
    const response = await api.get(`movies/filter/`, {
      params: {
        genre: genre,
        min_rating: minRating
      }
    });
    console.log("Полный ответ:", response);
    setMovies(response.data);
  } catch (error) {
    console.error("Полная ошибка:", error);
  }
};

  return (
    <div>
      <h1>Поиск фильмов</h1>
      <select onChange={(e) => setGenre(e.target.value)}>
        <option value="">Все жанры</option>
        <option value="Драма">Драма</option>
        <option value="Комедия">Комедия</option>
      </select>
      <input
        type="range"
        min="0"
        max="10"
        step="0.1"
        value={minRating}
        onChange={(e) => setMinRating(parseFloat(e.target.value))}
      />
      <span>Рейтинг: {minRating.toFixed(1)}+</span>
      <button onClick={handleSearch}>Найти</button>
      <div>
        {movies.map((movie) => (
          <div key={movie.id}>
            <h3>{movie.title}</h3>
            <p>Рейтинг: {movie.vote_average}</p>
            <p>Жанры: {movie.genres.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;