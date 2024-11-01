import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import { CitiesProvider } from "./contexts/CitiesContext";
import { AuthProvider } from "./contexts/FakeAuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";
import SignUp from "./pages/Signup";

function App() {
  return (
    //consuming the context by wrapping with context provider
    <BrowserRouter>
      <AuthProvider>
        <CitiesProvider>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="login" element={<Login />} />
            {/* Nested routing below */}
            <Route
              path="app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="cities" replace />} />
              <Route path="cities" element={<CityList />} />
              <Route path="cities/:id" element={<City />} />
              <Route path="countries" element={<CountryList />} />
              <Route path="form" element={<Form />} />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </CitiesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
