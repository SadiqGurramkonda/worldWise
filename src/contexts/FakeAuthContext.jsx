
import { createContext, useContext, useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom";




const BASE_URL = 'https://worldwise-api-vue7.onrender.com/worldwise/api/v1/user';

const AuthContext = createContext();

const intialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: ""
};

function reducer(state, action) {
  switch (action.type) {
    case "signup":
      return {...state,user:action.payload, isAuthenticated: true, isLoading:false};
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false };
    case "logout":
      return { ...state, user: null, isAuthenticated: false, isLoading: false };
    case "rejected":
      return {...state, isAuthenticated: false, isLoading: false , error: action.payload};
    case "loading":
      return {...state, isLoading: true}
    case "error/reset":
      return {...state, error: ""};
    default:
      throw new Error("unknown action type...");
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated, error, isLoading }, dispatch] = useReducer(
    reducer,
    intialState
  );
  // console.log(isAuthenticated);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app");
    }
  }, [isAuthenticated]);


  function resetError(){
    dispatch({type: "error/reset"});
  }

  async function login(email, password) {
    const payLoad = JSON.stringify({email,password});
    try{
       dispatch({type: "loading"}) ;
       dispatch({type: "error/reset"});
        const res = await fetch(`${BASE_URL}/login`,{
          method: 'POST',
          body: payLoad,
          headers:{
            "Content-Type": "application/json"
          }
        });
        const data = await res.json();
        if(!res.ok){
          dispatch({type: "rejected", payload: data.message});
          // console.log(data.message);
        }
        else{
          dispatch({type: "login",payload: data?.userName});
          localStorage.setItem("token",data.token);
          navigate("/app");
        }
    }
    catch(e){
      dispatch({type: "rejected", payload: "There was an error signing up!"})
    }
  };

  async function signup(username, email, password){
    
    const payLoad = JSON.stringify({username,email,password});
    // console.log(payLoad);
    try{
       dispatch({type: "loading"}) ;
       dispatch({type: "error/reset"});
        const res = await fetch(`${BASE_URL}/signup`,{
          method: 'POST',
          body: payLoad,
          headers:{
            "Content-Type": "application/json"
          }
        });
        const data = await res.json();
        if(!res.ok){
          dispatch({type: "rejected", payload: data.message});
          console.log(data.message);
        }
        else{
          dispatch({type: "signup",payload: username});
          localStorage.setItem("token",data.data.token);
          // navigate("/app");
        }
    }
    catch(e){
      dispatch({type: "rejected", payload: e.message});
    }
  }

  function logout() {
    dispatch({type: "error/reset"})
    dispatch({ type: "logout" });
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
        resetError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("AuthContext was used outside of AuthProvider");
  }

  return context;
}

export { AuthProvider, useAuth };
