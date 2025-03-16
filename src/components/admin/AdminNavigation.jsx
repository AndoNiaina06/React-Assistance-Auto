import { LuCommand } from "react-icons/lu";
import { FaEnvelope, FaCar, FaUsers, FaCalendarAlt, FaChartBar } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import {FaScrewdriverWrench, FaTruck, FaTicket} from "react-icons/fa6";


const AdminNavigation = () => {
    const location = useLocation();

    const navItems = [
        { name: "Dashboard", path: "/admin-dashboard", icon: <FontAwesomeIcon icon={faHouse} size="xl" className="text-[#3D3BF3]" /> },
        { name: "Messages", path: "/messages", icon: <FaEnvelope className="text-2xl text-[#3D3BF3]" /> },
    ];

    const managementItems = [
        { name: "Cars", path: "/car-list", icon: <FaCar className="text-2xl text-[#3D3BF3]" /> },
        { name: "Customers", path: "/customers", icon: <FaUsers className="text-2xl text-[#3D3BF3]" /> },
        { name: "Schedules", path: "/schedules", icon: <FaCalendarAlt className="text-2xl text-[#3D3BF3]" /> },
        { name: "Intervention", path: "/intervention", icon: <FaTruck className="text-2xl text-[#3D3BF3]" /> },
        { name: "Service", path: "/service", icon: <FaScrewdriverWrench className="text-2xl text-[#3D3BF3]" /> },
        { name: "Insurance", path: "/insurance", icon: <FaTicket className="text-2xl text-[#3D3BF3]" /> },
        { name: "Statistics", path: "/statistics", icon: <FaChartBar className="text-2xl text-[#3D3BF3]" /> },
    ];

    return (
        <nav className="w-60 bg-gray-100 shadow-md h-screen fixed flex flex-col p-6 text-black">
            <div className="flex flex-row">
                <LuCommand className="text-blue-900 mr-4 mb-5 text-[50px]" />
                <h1 className="text-xl font-bold mb-6">Carglass</h1>
            </div>

            <div className="space-y-4">
                <h3 className="text-gray-600 font-sans text-sm uppercase">Main Menu</h3>
                <ul className="flex flex-col space-y-2">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-semibold text-gray-800 transition 
                                    ${location.pathname === item.path ? "bg-blue-200" : "hover:bg-blue-200"}`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-6 space-y-2">
                <h3 className="text-gray-600 text-sm uppercase">Management</h3>
                <ul className="flex flex-col space-y-2">
                    {managementItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-semibold text-gray-800 transition 
                                    ${location.pathname === item.path ? "bg-blue-200" : "hover:bg-blue-200"}`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default AdminNavigation;
