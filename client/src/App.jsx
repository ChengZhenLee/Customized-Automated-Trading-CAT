import "./App.css";
import { Routes, Route } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from './hooks/useAuth';

function App() {
  const { _, loading } = useAuth();

  // Wait for onAuthStateChanged to finish
  if (loading) {
    return (
      <div>
        Loading...
      </div>
    );
  } else {
    // Include a protected route for dashboard and backtester depending if user is found or not
    return (
      <Routes>
        {/* Public Routes */}
        <Route index element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    );
  }
}

export default App;
