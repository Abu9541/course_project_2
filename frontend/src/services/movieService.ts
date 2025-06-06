import api from './api';

export const getMovies = async () => {
  const response = await api.get('movies/');
  return response.data;
};

export const getFilteredMovies = async (genre: string, minRating: number) => {
  const response = await api.get(`api/movies/filter/?genre=${genre}&min_rating=${minRating}`);
  return response.data;
};
