import { useState } from 'react';
import styles from './FiltersPanel.module.css';

interface FiltersPanelProps {
  onApply: (filters: { genres: string[]; minRating: number; year?: string }) => void;
  availableGenres: string[];
}

export const FiltersPanel = ({ onApply, availableGenres }: FiltersPanelProps) => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(5.0);
  const [year, setYear] = useState('');

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleApply = () => {
    onApply({ genres: selectedGenres, minRating, year });
  };

  return (
    <div className={styles.panel}>
      <div className={styles.section}>
        <h3 className={styles.headings}>Жанры</h3>
        {availableGenres.map(genre => (
          <label key={genre} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={selectedGenres.includes(genre)}
              onChange={() => handleGenreToggle(genre)}
            />
            {genre}
          </label>
        ))}
      </div>

      <div className={styles.section}>
        <h3 className={styles.headings}>Год выпуска</h3>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="2023"
          className={styles.input}
        />
      </div>

      <div className={styles.section}>
        <h3 className={styles.headings}>Рейтинг: {minRating.toFixed(1)}+</h3>
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={minRating}
          onChange={(e) => setMinRating(parseFloat(e.target.value))}
          className={styles.slider}
        />
      </div>

      <button onClick={handleApply} className={styles.button}>
        Применить
      </button>
    </div>
  );
};