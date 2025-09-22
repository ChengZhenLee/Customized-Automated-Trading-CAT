import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sets up the auth listener when the app is mounted
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Returns a cleanup function when the app is unmounted
    return () => { unsubscribe() };
  }, []);

  // Rerenders when loading changes
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
        <Route index element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route element={<ProtectedRoute user={user} redirect={"/"} />}>
          <Route path="/dashboard" element={<DashboardPage user={user} />} />
        </Route>
      </Routes>
    );
  }
}

export default App;
