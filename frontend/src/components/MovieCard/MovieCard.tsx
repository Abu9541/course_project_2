import { motion } from 'framer-motion';
import { Movie } from '@services/types';
import styles from './MovieCard.module.css';

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  // Анимация появления
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className={styles.card}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      <div className={styles.posterContainer}>
        {movie.poster_path ? (
          <img
            src={movie.poster_path}
            alt={movie.title}
            className={styles.poster}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.jpg';
            }}
          />
        ) : (
          <div className={styles.posterPlaceholder}>No Image</div>
        )}
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{movie.title}</h3>
        <div className={styles.rating}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`${styles.star} ${i < Math.round(movie.vote_average / 2) ? styles.filled : ''}`}
            >
              ★
            </span>
          ))}
          <span>({movie.vote_average.toFixed(1)})</span>
        </div>
        <div className={styles.genres}>
          {movie.genres.slice(0, 3).join(', ')}
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;