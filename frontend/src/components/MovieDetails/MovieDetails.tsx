import { Movie } from '@services/types';
import styles from './MovieDetails.module.css';

interface MovieDetailsProps {
  movie: Movie;
  onClose: () => void;
}

export const MovieDetails = ({ movie, onClose }: MovieDetailsProps) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>×</button>

        <div className={styles.backdropContainer}>
          {movie.backdrop_path && (
            <img
              src={movie.backdrop_path}
              alt={movie.title}
              className={styles.backdrop}
            />
          )}
        </div>

        <div className={styles.content}>
          <div className={styles.posterSide}>
            <img
              src={movie.poster_path}
              alt={movie.title}
              className={styles.poster}
            />
          </div>

          <div className={styles.infoSide}>
            <h2>{movie.title}</h2>

            <div className={styles.meta}>
              <span>{movie.release_date}</span>
              {movie.runtime && <span>{Math.floor(movie.runtime/60)}ч {movie.runtime%60}м</span>}
              {movie.age_rating && <span>{movie.age_rating}</span>}
            </div>

            <div className={styles.rating}>
              <span className={styles.voteAverage}>{movie.vote_average.toFixed(1)}</span>
              <span className={styles.voteCount}>     (голоса - {movie.vote_count})</span>
            </div>

            <div className={styles.genres}>
              {movie.genres.join(', ')}
            </div>

            <p className={styles.overview}>{movie.overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
};