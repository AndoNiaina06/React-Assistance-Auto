import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import AdminHome from "./pages/admin/AdminHome.jsx";
import UserHome from "./pages/user/UserHome.jsx";
import AdminCar from "./pages/admin/AdminCar.jsx";
import ProtectedRoutes from "./components/ProtectectRoute.jsx";
import AdminCustomer from "./pages/admin/AdminCustomer.jsx";
import AdminIntervention from "./pages/admin/AdminIntervention.jsx";
import AdminMessage from "./pages/admin/AdminMessage.jsx";
import AdminStat from "./pages/admin/AdminStat.jsx";
import AdminService from "./pages/admin/AdminService.jsx";
import AdminInsurance from "./pages/admin/AdminInsurance.jsx";
import UserCar from "./pages/user/UserCar.jsx";
import UserInsurance from "./pages/user/UserInsurance.jsx";
import UserIntervention from "./pages/user/UserIntervention.jsx";
import UserMessage from "./pages/user/UserMessage.jsx";


const App = () => {

    return (
        <Router>
            <Routes>

                {/*-------------------------authentification-----------------------*/}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />


                {/*-------------------------Admin route-----------------------*/}
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
                <Route
                    path="/customers"
                    element={
                        <ProtectedRoutes>
                            <AdminCustomer />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/intervention"
                    element={
                        <ProtectedRoutes>
                            <AdminIntervention />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/messages"
                    element={
                        <ProtectedRoutes>
                            <AdminMessage />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/statistics"
                    element={
                        <ProtectedRoutes>
                            <AdminStat />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/service"
                    element={
                        <ProtectedRoutes>
                            <AdminService />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/insurance"
                    element={
                        <ProtectedRoutes>
                            <AdminInsurance />
                        </ProtectedRoutes>
                    }
                />

                {/*------------------------- User Route -----------------------*/}
                <Route
                    path="/mycar"
                    element={
                        <ProtectedRoutes>
                            <UserCar />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/userinsurance"
                    element={
                        <ProtectedRoutes>
                            <UserInsurance />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/userintervention"
                    element={
                        <ProtectedRoutes>
                            <UserIntervention />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/user-messages"
                    element={
                        <ProtectedRoutes>
                            <UserMessage />
                        </ProtectedRoutes>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;