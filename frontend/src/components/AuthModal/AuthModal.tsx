import { useState } from 'react';
import { LoginForm } from '@auth/LoginForm';
import { RegisterForm } from '@auth/RegisterForm';
import styles from './AuthModal.module.css';
import api from '@services/api';

interface AuthModalProps {
  initialMode?: 'login' | 'register';
  onClose: () => void;
}

export const AuthModal = ({ initialMode = 'login', onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [error, setError] = useState('');

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login/', { username, password });
      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onClose();
        window.location.reload();
      }
    } catch (err) {
      setError('Неверные учетные данные');
    }
  };

  const handleRegister = async (username: string, password: string) => {
    try {
      const response = await api.post('/api/auth/register/', { username, password });
      if (response.status === 201) {
        setMode('login');
        setError('');
      }
    } catch (err) {
      setError('Пользователь уже существует или серверная ошибка');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {mode === 'login' ? (
            <>
              <LoginForm
                  onSuccess={onClose}
                  onLogin={handleLogin}
                  error={error}
              />
              <button onClick={onClose} className={styles.closeButton}>
                Закрыть
              </button>
              <div className={styles.switchText}>
                Нет аккаунта?{' '}
                <button
                    onClick={() => setMode('register')}
                    className={styles.switchButton}
                >
                  Зарегистрироваться
                </button>
              </div>
            </>
        ) : (
            <>
              <RegisterForm
                  onRegister={handleRegister}
                  onSwitchToLogin={() => setMode('login')}
                  error={error}
              />
              <button onClick={onClose} className={styles.closeButton}>
                Закрыть
              </button>
              <div className={styles.switchText}>
                Уже есть аккаунт?{' '}
                <button
                    onClick={() => setMode('login')}
                    className={styles.switchButton}
                >
                  Войти
                </button>
              </div>
            </>
        )}
      </div>
    </div>
  );
};
