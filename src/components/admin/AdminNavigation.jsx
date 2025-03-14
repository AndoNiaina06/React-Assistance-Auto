import { LuCommand } from "react-icons/lu";
import { FaEnvelope, FaCar, FaUsers, FaCalendarAlt, FaChartBar, FaHome } from "react-icons/fa";


const AdminNavigation = () => {
    return (
        <nav className="w-60 bg-gray-100 shadow-md h-screen fixed flex flex-col p-6 text-black">
            <div className="flex flex-row">
                <LuCommand className="text-blue-900 mr-4 mb-5 text-[50px]"/>

                <h1 className="text-xl font-bold mb-6">
                    Carglass
                </h1>
            </div>

            <div className="space-y-4">
                <h3 className="text-gray-600 font-sans text-sm uppercase">Main Menu</h3>

                <ul className="flex flex-col space-y-2">
                    <li>
                        <a href="admin-dashboard" className="flex items-center font-semibold text-gray-800 space-x-3 px-3 py-2 rounded-lg  hover:bg-blue-200">
                            <FaHome className="text-2xl text-[#3D3BF3]" />
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg font-semibold text-gray-800 hover:bg-blue-200">
                            <FaEnvelope className="text-2xl text-[#3D3BF3]" />
                            <span>Messages</span>
                        </a>
                    </li>
                </ul>
            </div>

            <div className="mt-6 space-y-2">
                <h3 className="text-gray-600 text-sm uppercase">Management</h3>

                <ul className="flex flex-col space-y-2">
                    <li>
                        <a href="/car-list" className="flex items-center space-x-3 px-3 py-2 rounded-lg font-semibold text-gray-800 hover:bg-blue-200">
                            <FaCar className="text-2xl text-[#3D3BF3]" />
                            <span>Cars</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg font-semibold text-gray-800 hover:bg-blue-200">
                            <FaUsers className="text-2xl text-[#3D3BF3]" />
                            <span>Customers</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg font-semibold text-gray-800 hover:bg-blue-200">
                            <FaCalendarAlt className="text-2xl text-[#3D3BF3]" />
                            <span>Schedules</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg font-semibold text-gray-800 hover:bg-blue-200">
                            <FaChartBar className="text-2xl text-[#3D3BF3]" />
                            <span>Statistics</span>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default AdminNavigation;
