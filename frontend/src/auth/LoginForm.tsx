import { useState } from 'react';
import api from '@services/api';
import styles from './LoginForm.module.css';
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onSuccess: () => void;
  onLogin?: (username: string, password: string) => void;
  onClose?: () => void;
  error?: string;
}

export const LoginForm = ({ onSuccess, onLogin, onClose, error: propError }: LoginFormProps) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();

  // Объединяем ошибки из пропсов и локального состояния
  const errorMessage = propError || localError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    try {
      const response = await api.post('/api/auth/login/', formData);
      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('user', JSON.stringify({
          username: response.data.username,
          id: response.data.user_id
        }));
        onSuccess();
        window.location.href = '/';
      } else {
        setLocalError('Ошибка сервера');
      }
    } catch (error) {
      setLocalError('Неверный логин или пароль');
      console.error('Login error:', error);
    }
  };

  return (
    <div className={styles.loginContainer}>
    <form onSubmit={handleSubmit} className={styles.loginForm}>
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
        <h2 className={styles.title}>Вход</h2>

        <div className={styles.formGroup}>
          <label className={styles.label}>Имя пользователя:</label>
          <input
            type="text"
            className={styles.input}
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            placeholder="Введите ваш логин"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Пароль:</label>
          <input
            type="password"
            className={styles.input}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            placeholder="Введите ваш пароль"
          />
        </div>
        {errorMessage && <div className={styles.error}>{errorMessage}</div>}
        <button type="submit" className={styles.submitButton}>
          Войти
        </button>
      </form>
    </div>
  );
};
