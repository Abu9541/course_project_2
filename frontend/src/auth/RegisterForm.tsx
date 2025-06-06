import { useState } from 'react';
import styles from './RegisterForm.module.css';

interface RegisterFormProps {
  onRegister: (username: string, password: string) => void;
  onSwitchToLogin: () => void;
  onClose?: () => void;
  error?: string;
}

export const RegisterForm = ({
  onRegister,
  onSwitchToLogin,
  onClose,
  error: propError
}: RegisterFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    try {
      await onRegister(username, password);
    } catch (error) {
      setLocalError('Ошибка регистрации');
      console.error('Register error:', error);
    }
  };

  const errorMessage = propError || localError;

  return (
    <div className={styles.registerContainer}>
      <form onSubmit={handleSubmit} className={styles.registerForm}>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Закрыть"
          >
            ×
          </button>
        )}
        <h2 className={styles.title}>Регистрация</h2>
        {errorMessage && <div className={styles.error}>{errorMessage}</div>}
        <div className={styles.formGroup}>
          <label className={styles.label}>Имя пользователя:</label>
          <input
            type="text"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Придумайте логин"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Пароль:</label>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Придумайте пароль"
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Зарегистрироваться
        </button>
        <p className={styles.switchText}>
          Уже есть аккаунт?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className={styles.switchButton}
          >
            Войти
          </button>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;