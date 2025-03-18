import { FiBell, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios.js";
import { useSelector } from "react-redux";

const UserHeader = () => {
    const navigate = useNavigate();
    const userState = useSelector((state) => state.user);
    const user = userState.user;

    const logout = async () => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                await api.post(
                    "/logout",
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                localStorage.removeItem("token");
                navigate("/");
            } catch (error) {
                console.error("Erreur lors de la déconnexion:", error);
            }
        }
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-white text-gray-800 px-6 py-4 flex justify-between items-center border-b border-gray-200 shadow-lg z-20 transition-all duration-300 ease-in-out">
            {/* Profil utilisateur à gauche */}
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-[#0078D4] flex items-center justify-center text-white font-semibold text-lg shadow-md">
                        {user?.lname ? user.lname[0] : "A"}
                    </div>
                    <div>
                        <h1 className="text-sm font-['Inter', sans-serif] font-medium text-gray-900">
                            {user?.lname || "Utilisateur"}
                        </h1>
                        <p className="text-xs font-['Inter', sans-serif] font-normal text-gray-500">
                            {user?.email || "user@example.com"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Boutons à droite */}
            <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-3 py-1 bg-gray-50 border border-gray-200 rounded-md text-sm font-['Inter', sans-serif] font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-200 transition duration-200">
                    <FiBell className="text-[#0078D4] text-lg" />
                    <span>Notifications</span>
                </button>
                <button
                    onClick={logout}
                    className="flex items-center space-x-2 px-3 py-1 bg-gray-50 border border-gray-200 rounded-md text-sm font-['Inter', sans-serif] font-medium text-gray-700 hover:bg-blue-50 hover:border-white-200 transition duration-200"
                >
                    <FiUser className="text-[#0078D4] text-lg" />
                    <span>Log out</span>
                </button>
            </div>
        </header>
    );
};

export default UserHeader;
