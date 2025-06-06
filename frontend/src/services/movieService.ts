import api from './api';

export const getMovies = async () => {
  const response = await api.get('movies/');
  return response.data;
};

export const getFilteredMovies = async (params: string) => {
  const response = await api.get(`api/movies/filter/?${params}`);
  return response.data;
};