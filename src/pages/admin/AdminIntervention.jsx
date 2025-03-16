import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import AdminNavigation from "../../components/admin/AdminNavigation.jsx";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import api from "../../services/axios.js";

const AdminIntervention = () => {
    const [interventions, setInterventions] = useState([]);
    const [filteredInterventions, setFilteredInterventions] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        const token = localStorage.getItem("token");
        api.get("interventions", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                setInterventions(response.data.data);
                setFilteredInterventions(response.data.data);
            })
            .catch((error) => {
                console.error("Erreur lors du chargement des interventions:", error);
            });
    }, []);

    useEffect(() => {
        if (statusFilter === "all") {
            setFilteredInterventions(interventions);
        } else {
            setFilteredInterventions(interventions.filter(intervention => intervention.status === statusFilter));
        }
    }, [statusFilter, interventions]);

    // Fonction pour changer le statut de initio → in progress
    const startIntervention = (id, userId, carId) => {
        const token = localStorage.getItem("token");
        api.put(`interventions/${id}`, {
            status: "in progress",
            user_id: userId,
            car_id: carId,
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                // Mise à jour du statut localement
                setInterventions(interventions.map(intervention =>
                    intervention.id === id ? { ...intervention, status: "in progress" } : intervention
                ));
            })
            .catch((error) => {
                console.error("Erreur lors de la mise à jour de l'intervention:", error);
            });
    };

    return (
        <div>
            <AdminNavigation />
            <AdminHeader />
            <div className="ml-64 mt-6 mr-6 p-8 bg-gray-200 shadow-lg rounded-xl">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Interventions</h3>

                <select
                    className="mb-4 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="initio">Initio</option>
                    <option value="in progress">In Progress</option>
                    <option value="finished">Finished</option>
                </select>

                {/* Tableau des interventions */}
                <table className="min-w-full bg-white border rounded-lg overflow-hidden shadow-md">
                    <thead className="bg-blue-700 text-white">
                    <tr>
                        <th className="px-6 py-3 text-left">Type</th>
                        <th className="px-6 py-3 text-left">Date</th>
                        <th className="px-6 py-3 text-left">Customer</th>
                        <th className="px-6 py-3 text-left">Véhicule</th>
                        <th className="px-6 py-3 text-left">Statut</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredInterventions.length > 0 ? (
                        filteredInterventions.map((intervention) => (
                            <tr key={intervention.id} className="border-b hover:bg-gray-100 transition">
                                <td className="px-6 py-2">{intervention.typeintervention}</td>
                                <td className="px-6 py-2">{new Date(intervention.datedemand).toLocaleDateString()}</td>
                                <td className="px-6 py-2">{intervention.user.fname} {intervention.user.lname}</td>
                                <td className="px-6 py-2">{intervention.car.carname} - {intervention.car.immatriculation}</td>
                                <td className="px-6 py-2 flex items-center space-x-2">
                                    {intervention.status === "in progress" ? (
                                        <>
                                            <FaSpinner className="animate-spin text-blue-500" />
                                            <span className="text-blue-500 font-semibold">In Progress</span>
                                        </>
                                    ) : intervention.status === "finished" ? (
                                        <>
                                            <FontAwesomeIcon icon={faCircleCheck} size="lg" className="text-green-500" />
                                            <span className="text-green-500 font-semibold">Finished</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="bg-yellow-500 text-white px-3 py-1 rounded-lg">Initio</span>
                                            <button
                                                onClick={() => startIntervention(intervention.id, intervention.user.id, intervention.car.id)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg ml-2 transition"
                                            >
                                                Start
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center py-4 text-gray-700">No intervention</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminIntervention;
