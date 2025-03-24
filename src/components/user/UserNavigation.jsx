import { FiMessageSquare, FiBarChart2 } from "react-icons/fi";
import { FaCar } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const UserNavigation = () => {
    const location = useLocation();

    const navItems = [
        {
            name: "Messages",
            path: "/user-messages",
            icon: <FiMessageSquare className="text-xl" />,
        },
        {
            name: "My car",
            path: "/mycar",
            icon: <FaCar className="text-xl" />,
        },
        {
            name: "History_user",
            path: "/statistics_user",
            icon: <FiBarChart2 className="text-xl" />,
        },
        {
            name: "Interventions",
            path: "/userintervention",
            icon: <FiBarChart2 className="text-xl" />,
        },
        {
            name: "Insurance",
            path: "/userinsurance",
            icon: <FiBarChart2 className="text-xl" />,
        },
    ];

    return (
        <nav className="fixed top-[67px] left-0 h-[calc(100vh-72px)] w-64 bg-gradient-to-b from-gray-50 to-gray-100 shadow-2xl border-r border-gray-300 z-10 rounded-r-2xl overflow-hidden">
            {/* En-tête de la sidebar */}
            <div className="p-4 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            </div>

            {/* Contenu de navigation */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {navItems.map((item) => (
                    <li key={item.path} className="list-none">
                        <Link
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-2 rounded-xl font-['Inter', sans-serif] font-medium text-lg text-gray-700 transition-all duration-100 ${
                                location.pathname === item.path
                                    ? "bg-blue-100 text-[#1E40AF] shadow-inner"
                                    : "hover:bg-gray-200 hover:text-gray-900"
                            }`}
                            aria-current={
                                location.pathname === item.path ? "page" : undefined
                            }
                        >
                            <div className="flex items-center justify-center w-6.5 h-6.5 text-[#1E40AF]">
                                {item.icon}
                            </div>
                            <span className="truncate">{item.name}</span>
                        </Link>
                    </li>
                ))}
            </div>
        </nav>
    );
};

export default UserNavigation;
