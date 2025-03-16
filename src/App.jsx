import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminHome from "./pages/admin/AdminHome.jsx";
import UserHome from "./pages/user/UserHome.jsx";
import AdminCar from "./pages/admin/AdminCar.jsx";
import UserCar from "./pages/user/UserCar.jsx";
import UserCarList from "./pages/user/UserCarList.jsx";
import AdminListIntervention from "./pages/admin/AdminListIntervention.jsx";
import UserListIntervention from "./pages/user/UserListIntervention.jsx";
const App = () => {
  const isAuthenticated = () => {
    console.log("isAuthenticated checked");
    return localStorage.getItem("token") !== null;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin-dashboard"
          element={isAuthenticated() ? <AdminHome /> : <Navigate to="/" />}
        />
        <Route
          path="/user-dashboard"
          element={isAuthenticated() ? <UserHome /> : <Navigate to="/" />}
        />
        <Route
          path="/car-list_admin"
          element={isAuthenticated() ? <AdminCar /> : <Navigate to="/" />}
        />
        <Route
          path="/car-list_user"
          element={isAuthenticated() ? <UserCarList /> : <Navigate to="/" />}
        />
        <Route
          path="/add-car"
          element={isAuthenticated() ? <UserCar /> : <Navigate to="/" />}
        />
        <Route
          path="/AdminListIntervention"
          element={
            isAuthenticated() ? <AdminListIntervention /> : <Navigate to="/" />
          }
        />
        <Route
          path="/UserListIntervention"
          element={
            isAuthenticated() ? <UserListIntervention /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
