import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthProps {
  user: {
    username: string;
  };
}

export const withAuth = <P extends object>(Component: React.ComponentType<P & AuthProps>) => {
  return (props: P) => {
    const navigate = useNavigate();
    const userData = localStorage.getItem('user');

    useEffect(() => {
      if (!localStorage.getItem('token')) {
        navigate('/');
      }
    }, []);

    if (!userData) return null;

    return <Component {...props} user={JSON.parse(userData)} />;
  };
};