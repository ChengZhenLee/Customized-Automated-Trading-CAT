import "./App.css";
import { Routes, Route } from "react-router-dom";
import { MainMenuPage } from "./pages/MainMenuPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from './hooks/useAuth';
import { MyConfigsPage } from "./pages/MyConfigsPage";

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route index element={<MainMenuPage />} />
          <Route path="/myconfigs" element={<MyConfigsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    );
  }
}

export default App;
