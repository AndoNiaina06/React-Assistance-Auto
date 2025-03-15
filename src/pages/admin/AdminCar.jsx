import React, { useState, useEffect } from "react";
import AdminNavigation from "../../components/admin/AdminNavigation.jsx";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import api from "../../services/axios.js";
import { FaPen, FaTrash } from "react-icons/fa";

const AdminCar = () => {
    //state
    const [cars, setCars] = useState([]);

    const token = localStorage.getItem("token");

    //comportement
    useEffect(() => {
        const token = localStorage.getItem("token");

        api.get("cars", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                console.log(response.data.data);
                setCars(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    //render
    return (
        <div>
            <AdminNavigation />
            <AdminHeader />
            <div className="ml-60 p-10">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Liste des voitures</h2>
                {cars.length > 0 ? (
                    <table className="min-w-full table-auto border-collapse rounded-lg shadow-lg">
                        <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="px-6 py-3 text-left">Nom de la voiture</th>
                            <th className="px-6 py-3 text-left">Immatriculation</th>
                            <th className="px-6 py-3 text-left">Marque</th>
                            <th className="px-6 py-3 text-left">Client</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cars.map((car, index) => (
                            <tr
                                key={index}
                                className={`odd:bg-gray-100 even:bg-white hover:bg-gray-50 transition-colors duration-200`}
                            >
                                <td className="px-6 py-4 border-b">{car.carname}</td>
                                <td className="px-6 py-4 border-b">{car.immatriculation}</td>
                                <td className="px-6 py-4 border-b">{car.marque}</td>
                                <td className="px-6 py-4 border-b">{car.user.fname}</td>
                                <td className="px-6 py-4 border-b text-center">
                                    <button className="bg-blue-500 text-white rounded-md px-4 py-2 mr-2 hover:bg-blue-600 transition-colors">
                                        <FaPen className="text-lg inline mr-1" />view
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-700">Loading...</p>
                )}
            </div>
        </div>
    );
}

export default AdminCar;
