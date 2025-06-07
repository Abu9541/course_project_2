export interface Movie {
  id: number;
  tmdb_id: number;
  title: string;
  overview: string;
  poster_path?: string;
  backdrop_path: string | null;
  release_date: string;
  runtime: number | null;
  vote_average: number;
  vote_count: number;
  genres: string[];
  original_language: string | null;
  age_rating: string | null;
}