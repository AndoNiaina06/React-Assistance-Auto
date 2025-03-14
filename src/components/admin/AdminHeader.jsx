import { useState, useEffect } from "react";
import { LuBell, LuUserRound, LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios.js";

const AdminHeader = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const fetchUserProfile = async () => {
                try {
                    const response = await api.get('/userProfile', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUserName(response.data.fname);
                } catch (error) {
                    console.error("Erreur lors de la récupération du profil utilisateur", error);
                }
            };

            fetchUserProfile();
        }
    }, []);

    const logout = async () => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                await api.post('/logout', {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                localStorage.removeItem("token");
                navigate("/");
            } catch (error) {
                console.error("Erreur lors de la déconnexion:", error);
            }
        }
    };

    return (
        <header className="bg-white ml-60 text-black shadow-md px-6 py-7 flex justify-between items-center">
            <h1 className="text-xl font-bold">{userName}</h1>

            <div className="flex items-center space-x-6">
                <div className="relative bg-gray-300 p-2 rounded-3xl">
                    <LuBell className="text-2xl text-blue-900 cursor-pointer" />
                </div>

                <div className="relative bg-gray-300 p-2 rounded-3xl">
                    <LuUserRound
                        className="text-2xl text-blue-900 cursor-pointer"
                        onClick={() => setShowMenu(!showMenu)}
                    />
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2">
                            <a
                                onClick={logout}
                                className="flex flex-row justify-between px-4 py-2 text-gray-800 font-semibold hover:bg-blue-200 cursor-pointer"
                            >
                                Logout
                                <LuLogOut className="text-black text-2xl font-semibold" />
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
