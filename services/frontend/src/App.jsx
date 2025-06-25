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
import GuestPage from "./pages/guest"; // Import your guest page component
import PrivateRoute from "./components/PrivateRoute";
import AuthProvider from "./components/AuthProvider";
import { useAuthStore } from "./store/AuthStore";
import "./index.css";
import UpdateInformations from "./pages/guest/guestProfile/updateInformations";

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={user ? <Navigate to="/guest" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/guest" /> : <Register />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Guest route */}
          <Route path="/guest" element={<GuestPage />} />

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
          <Route path="/profile/update" element={<UpdateInformations />} />

          {/* Redirect to guest page or login */}
          <Route
            path="/"
            element={user ? <Navigate to="/guest" /> : <Navigate to="/login" />}
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
