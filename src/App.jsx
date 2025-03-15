import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import AddCar from "./components/AddCar"; // Ajouté
import AdminHome from "./pages/admin/AdminHome.jsx";
import UserHome from "./pages/user/UserHome.jsx";
import AdminCar from "./pages/admin/AdminCar.jsx";

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
          path="/car-list"
          element={isAuthenticated() ? <AdminCar /> : <Navigate to="/" />}
        />
        <Route
          path="/add-car"
          element={isAuthenticated() ? <AddCar /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
