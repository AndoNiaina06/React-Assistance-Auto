import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import api from "../services/axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Réinitialise l'erreur

        try {
            const response = await api.post("/login", { email, password });

            if (response.status === 200) {
                // Vérification du rôle
                if (response.data.data.role === 'admin') {
                    console.log("Vous êtes authentifié", response.data.data.fname);
                    navigate("/admin-dashboard");
                } else if (response.data.data.role === 'user') {
                    console.log("Vous êtes authentifié", response.data.data.fname);
                    navigate("/user-dashboard");
                }
            }
        } catch (err) {
            console.error("Erreur lors de l'authentification :", err.response?.data);

            setError(err.response?.data?.msg || err.response?.data?.message || "Erreur de connexion");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Connexion</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="relative mb-4">
                        <FaUser className="absolute left-3 top-4 text-gray-400" />
                        <input type="email" placeholder="Email" className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                               onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="relative mb-4">
                        <FaLock className="absolute left-3 top-4 text-gray-400" />
                        <input type="password" placeholder="Mot de passe" className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                               onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white font-sans text-lg p-2 rounded-[25px] hover:bg-blue-600 transition">
                        Sign in
                    </button>
                </form>
                <p className="text-center text-gray-600 mt-4">Forgot Password ? <span className="text-blue-500 cursor-pointer">Reset</span></p>
                <p className="text-center text-gray-600 mt-4">
                    <a href="/register" className="text-blue-500">Create account</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
