import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import Dashboard from "./pages/Dashboard";
import GuestPage from "./pages/guest"; 
import PrivateRoute from "./components/PrivateRoute";
import AuthProvider from "./components/AuthProvider";
import { useAuthStore } from "./store/AuthStore";
import "./index.css";
import UpdateInformations from "./pages/guest/guestProfile/updateInformations";

// Import the stays pages
import StaysPage from "./pages/guest/stays/StaysPage";
import StayDetailPage from "./pages/guest/stays/StayDetailPage";
import CreateStayPage from "./pages/guest/stays/CreateStayPage";
import EditStayPage from "./pages/guest/stays/EditStayPage";

// Import the cars pages
import CarsPage from "./pages/guest/cars/CarsPage";
import CarDetailsPage from "./pages/guest/cars/CarDetailsPage";
import CreateCarPage from "./pages/guest/cars/CreateCarPage";
import EditCarPage from "./pages/guest/cars/EditCarPage";

// Import the ErrorBoundary
import ErrorBoundary from "./components/ErrorBoundary";

// Add this import
import BecomeHostPage from "./pages/guest/host/BecomeHostPage";

function App() {
  // Get user and token to check for authentication
  const { user, token } = useAuthStore();
  
  // Check if user is authenticated
  const isAuthenticated = !!(user && token);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes - redirect only if authenticated */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/guest" /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/guest" /> : <Register />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Guest route */}
          <Route 
            path="/guest" 
            element={isAuthenticated ? <GuestPage /> : <Navigate to="/login" />} 
          />
          
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/update-informations"
            element={
              <PrivateRoute>
                <UpdateInformations />
              </PrivateRoute>
            }
          />
          <Route 
            path="/profile/update" 
            element={isAuthenticated ? <UpdateInformations /> : <Navigate to="/login" />} 
          />
          
          {/* Stays routes - PUBLIC, no authentication required */}
          <Route path="/stays" element={<StaysPage />} />
          <Route path="/stays/create" element={<CreateStayPage />} />
          <Route path="/stays/edit/:id" element={<EditStayPage />} />
          <Route path="/stays/:id" element={<StayDetailPage />} />
          
          {/* Car routes - PUBLIC, no authentication required */}
          <Route 
            path="/cars" 
            element={
              <ErrorBoundary>
                <CarsPage />
              </ErrorBoundary>
            } 
          />
          <Route path="/cars/create" element={<CreateCarPage />} /> {/* More specific route first */}
          <Route path="/cars/:id/edit" element={<EditCarPage />} /> {/* More specific route first */}
          <Route path="/cars/:id" element={<CarDetailsPage />} /> {/* Parameter route last */}
          
          {/* Redirect to guest page or login */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/guest" /> : <Navigate to="/login" />}
          />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/become-host" element={<BecomeHostPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
