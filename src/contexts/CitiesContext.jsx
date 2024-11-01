
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { useAuth } from "./FakeAuthContext";

const BASE_URL = 'https://worldwise-api-vue7.onrender.com/worldwise/api/v1';
// 1) create a context
const citiesContext = createContext();

const intialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city._id !== action.payload),
      };
    default:
      throw new Error("unknown action type");
  }
}


function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    intialState
  );

  const {isAuthenticated} = useAuth();
  console.log(cities);

  useEffect(function(){
    async function getCities(){
      await fetchCities();
    };
    if(isAuthenticated){
      getCities();
    }
    
  },[isAuthenticated]);

  
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`,{
          headers: {
            "Authorization":  `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data.data.cities });
        console.log(data);
      } catch (e) {
        dispatch({
          type: "rejected",
          payload: "There was an error loading cities",
        });
      }
    }

  async function getCity(id) {
    dispatch({ type: "loading" });
    try {
      const city = cities.find(city => city._id === id);
      dispatch({ type: "city/loaded", payload: city });
    } catch (e) {
      dispatch({
        type: "rejected",
        payload: "There was an error loading city",
      });
    }
  }

  async function createCity(newCity) {
    console.log("create city called,",newCity);
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: data.createdCity });
    } catch (e) {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city...",
      });
    }
  }

  async function removeCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch (e) {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the city...",
      });
    }
  }
  return (
    <citiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        removeCity,
      }}
    >
      {children}
    </citiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(citiesContext);
  if (context === undefined) {
    throw new Error("Cities context used outside of cities Provider");
  }

  return context;
}

export { CitiesProvider, useCities };
