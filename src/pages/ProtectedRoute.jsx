import { useEffect } from 'react';
import { useAuth } from '../contexts/FakeAuthContext';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!isAuthenticated) {
        navigate('/');
      }
    },
    [isAuthenticated, navigate]
  );
  if (isLoading) {
    return <div>loading...please wait!</div>;
  }
  return isAuthenticated ? children : null;
}

export default ProtectedRoute;
