import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthContext";


function GuestRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Wait for the initial /getuser check to finish before deciding
  if (isLoading) return <div>Loading...</div>;

  // If they ARE authenticated, don't let them see the login/signup page. 
  // Send them to the app.
  return isAuthenticated ? <Navigate to="/app" replace /> : children;
}

export default GuestRoute;