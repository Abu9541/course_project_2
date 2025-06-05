export interface Movie {
  id: number;
  tmdb_id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genres: string[];
}