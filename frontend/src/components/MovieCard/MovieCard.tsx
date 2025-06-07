import { motion } from 'framer-motion';
import { Movie } from '@services/types';
import styles from './MovieCard.module.css';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  return (
    <motion.div
      layout
      className={styles.card}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3, type: "spring" }}
      onClick={onClick}
      layoutId={`movie-${movie.id}`}
    >
      <div className={styles.posterContainer}>
        {movie.poster_path ? (
          <motion.img
            src={movie.poster_path}
            alt={movie.title}
            className={styles.poster}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.jpg';
            }}
            layoutId={`poster-${movie.id}`}
          />
        ) : (
          <div className={styles.posterPlaceholder}>No Image</div>
        )}
      </div>

      <div className={styles.info}>
        <motion.h3 className={styles.title} layoutId={`title-${movie.id}`}>
          {movie.title}
        </motion.h3>
        <motion.div className={styles.rating} layoutId={`rating-${movie.id}`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`${styles.star} ${i < Math.round(movie.vote_average / 2) ? styles.filled : ''}`}
            >
              ★
            </span>
          ))}
          <span>({movie.vote_average.toFixed(1)})</span>
        </motion.div>
        <motion.div className={styles.genres} layoutId={`genres-${movie.id}`}>
          {movie.genres.slice(0, 3).join(', ')}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MovieCard;