import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import LoginScreen from "./pages/authentication/Login";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import CreateTeacher from "./pages/Teachers/CreateTeacher";
import Teachers from "./pages/Teachers/Teachers";
import Class from "./pages/Class/Class";
import CreateClass from "./pages/Class/CreateClass";
import Schools from "./pages/Schools/Schools";
import CreateSchool from "./pages/Schools/CreateSchool";
import Subjects from "./pages/Subject/Subject";
import CreateSubject from "./pages/Subject/CreateSubject";
import ScheduleManagement from "./pages/ScheduleManagement/ScheduleManagement";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<null | boolean>(null);

  const isAuthenticated = () => {
    const token = localStorage.getItem("authToken");
    return !!token;
  };

  useEffect(() => {
    // setIsLoggedIn(isAuthenticated());
    setIsLoggedIn(true);
  }, []);

  if (isLoggedIn === null) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginScreen />}
        />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/teachers"
          element={isLoggedIn ? <Teachers /> : <Navigate to="/login" />}
        />
        <Route
          path="/teachers/create/:id?"
          element={isLoggedIn ? <CreateTeacher /> : <Navigate to="/login" />}
        />
        <Route
          path="/classes"
          element={isLoggedIn ? <Class /> : <Navigate to="/login" />}
        />
        <Route
          path="/classes/create/:id?"
          element={isLoggedIn ? <CreateClass /> : <Navigate to="/login" />}
        />
        <Route
          path="/schools"
          element={isLoggedIn ? <Schools /> : <Navigate to="/login" />}
        />
        <Route
          path="/schools/create/:id?"
          element={isLoggedIn ? <CreateSchool /> : <Navigate to="/login" />}
        />
        <Route
          path="/subjects"
          element={isLoggedIn ? <Subjects /> : <Navigate to="/login" />}
        />
        <Route
          path="/subjects/create/:id?"
          element={isLoggedIn ? <CreateSubject /> : <Navigate to="/login" />}
        />
        <Route
          path="/weekly-schedule"
          element={
            isLoggedIn ? <ScheduleManagement /> : <Navigate to="/login" />
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
