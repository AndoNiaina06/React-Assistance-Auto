import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminHome from "./pages/admin/AdminHome.jsx";
import UserHome from "./pages/user/UserHome.jsx";

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Vérifier si l'utilisateur est connecté
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Route protégée : redirige si pas connecté
    const ProtectedRoute = ({ children, role }) => {
        if (!user) {
            return <Navigate to="/" />;
        }
        if (role && user.role !== role) {
            return <Navigate to="/" />;
        }
        return children;
    };
    if (user) {
        if (user.role === 'admin') {
            return <Navigate to="/admin-dashboard" />;
        } else {
            return <Navigate to="/user-dashboard" />;
        }
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin-dashboard" element={<AdminHome />} />
                <Route path="/user-dashboard" element={<UserHome />} />
            </Routes>
        </Router>
    );
};

export default App;
