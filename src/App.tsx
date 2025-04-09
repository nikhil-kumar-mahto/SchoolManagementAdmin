import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import LoginScreen from "./pages/authentication/Login";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/common/Layout/Layout";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isAuthenticated = () => {
    const token = localStorage.getItem("authToken");
    return !!token;
  };

  useEffect(() => {
    // setIsLoggedIn(isAuthenticated());
    setIsLoggedIn(true);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to={"/"} /> : <LoginScreen />}
        />
        <Route
          path="/*"
          element={
            isLoggedIn ? (
              <Layout>
                <Routes>
                  <Route index element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
