import { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL =
  'https://worldwise-api-vue7.onrender.com/worldwise/api/v1/user';

const BASE_URL_DEVELOP = 'http://localhost:8080/worldwise/api/v1/user';

const AuthContext = createContext();

const intialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'session/restored':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'session/failed':
      return { ...state, user: null, isAuthenticated: false, isLoading: false };
    case 'signup':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'login':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'logout':
      return { ...state, user: null, isAuthenticated: false, isLoading: false };
    case 'rejected':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'loading':
      return { ...state, isLoading: true };
    case 'error/reset':
      return { ...state, error: '' };
    default:
      throw new Error('unknown action type...');
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated, error, isLoading }, dispatch] = useReducer(
    reducer,
    intialState
  );
  // console.log(isAuthenticated);

  const navigate = useNavigate();

  //app load verification:
  useEffect(() => {
    async function verifySession() {
      try {
        const res = await fetch(`${BASE_URL_DEVELOP}/getuser`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        console.log('verifySession res --->', data);
        if (res.ok && data) {
          dispatch({ type: 'session/restored', payload: data.userName });
        } else {
          dispatch({ type: 'session/failed' });
        }
      } catch (e) {
        console.log('error verifySession', e);
      }
    }
    verifySession();
  }, []);

  function resetError() {
    dispatch({ type: 'error/reset' });
  }

  async function login(email, password) {
    const payLoad = JSON.stringify({ email, password });
    try {
      dispatch({ type: 'loading' });
      dispatch({ type: 'error/reset' });
      const res = await fetch(`${BASE_URL_DEVELOP}/login`, {
        method: 'POST',
        body: payLoad,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch({ type: 'rejected', payload: data.message });
        // console.log(data.message);
      } else {
        dispatch({ type: 'login', payload: data?.userName });
        // localStorage.setItem("token",data.token);
        navigate('/app');
      }
    } catch (e) {
      dispatch({ type: 'rejected', payload: 'There was an error signing up!' });
    }
  }

  async function signup(username, email, password) {
    const payLoad = JSON.stringify({ username, email, password });
    // console.log(payLoad);
    try {
      dispatch({ type: 'loading' });
      dispatch({ type: 'error/reset' });
      const res = await fetch(`${BASE_URL_DEVELOP}/signup`, {
        method: 'POST',
        body: payLoad,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch({ type: 'rejected', payload: data.message });
        console.log(data.message);
      } else {
        dispatch({ type: 'signup', payload: username });
        localStorage.setItem('token', data.data.token);
        // navigate("/app");
      }
    } catch (e) {
      dispatch({ type: 'rejected', payload: e.message });
    }
  }

  async function logout() {
    try {
      dispatch({ type: 'loading' });
      await fetch(`${BASE_URL_DEVELOP}/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      dispatch({ type: 'error/reset' });
      dispatch({ type: 'logout' });
    } catch (err) {
      console.error('Failed to log out properly:', err);
      // Fallback: Even if the network fails, we should clear the UI state to protect the screen
      dispatch({ type: 'error/reset' });
    }
  }
  return (
    <AuthContext.Provider
      value={{
        error,
        isLoading,
        user,
        isAuthenticated,
        signup,
        login,
        logout,
        resetError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('AuthContext was used outside of AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
