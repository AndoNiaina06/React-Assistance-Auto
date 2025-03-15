import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import AdminHome from "./pages/admin/AdminHome.jsx";
import UserHome from "./pages/user/UserHome.jsx";
import AdminCar from "./pages/admin/AdminCar.jsx";
import ProtectedRoutes from "./components/ProtectectRoute.jsx";


const App = () => {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/admin-dashboard"
                    element={
                    <ProtectedRoutes>
                        <AdminHome />
                    </ProtectedRoutes>
                    }
                />
                <Route
                    path="/user-dashboard"
                    element={
                    <ProtectedRoutes>
                        <UserHome />
                    </ProtectedRoutes>
                    }
                />
                <Route
                    path="/car-list"
                    element={
                    <ProtectedRoutes>
                        <AdminCar />
                    </ProtectedRoutes>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;