import { createContext, useContext, useEffect, useState } from "react";

const BASE_URL = "http://localhost:8000";
// 1) create a context
const citiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const cities = await res.json();
        setCities(cities);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch (e) {
      alert("There was an error loading the data...");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <citiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
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
