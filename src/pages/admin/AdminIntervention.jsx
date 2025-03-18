import React, { useEffect, useState } from "react";
import { FaSpinner, FaSearch, FaUser, FaCar, FaCalendarAlt, FaTruck } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import AdminNavigation from "../../components/admin/AdminNavigation.jsx";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import api from "../../services/axios.js";

const AdminIntervention = () => {
    const [interventions, setInterventions] = useState([]);
    const [filteredInterventions, setFilteredInterventions] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [expandedInterventionId, setExpandedInterventionId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        api.get("interventions", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                //onsole.log(response.data.data);
                setInterventions(response.data.data);
                setFilteredInterventions(response.data.data);
            })
            .catch((error) => {
                console.error("Erreur lors du chargement des interventions:", error);
            });
    }, []);

    useEffect(() => {
        let filtered = interventions;
        if (statusFilter !== "all") {
            filtered = filtered.filter(intervention => intervention.status === statusFilter);
        }
        if (search) {
            filtered = filtered.filter(intervention =>
                intervention.user.fname.toLowerCase().includes(search.toLowerCase()) ||
                intervention.user.lname.toLowerCase().includes(search.toLowerCase()) ||
                intervention.car.carname.toLowerCase().includes(search.toLowerCase())
            );
        }
        setFilteredInterventions(filtered);
    }, [statusFilter, search, interventions]);

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

            <div className="ml-64 mt-6 mr-6 p-8 bg-gray-100">
                <div className="bg-white p-6 rounded-2xl shadow-xl">
                    {/* En-tête et recherche */}
                    <div className="mb-8 border-b border-gray-200 pb-6">
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-4">
                            <FaTruck className="mr-3 text-blue-500" />
                            List of interventions
                        </h1>
                        <div className="flex gap-4">
                            <div className="relative flex-1 max-w-md">
                                <FaSearch className="absolute top-4 left-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search Intervention..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-300"
                                />
                            </div>
                            <select
                                className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-300"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All statuts</option>
                                <option value="initio">Initio</option>
                                <option value="in progress">in Progress</option>
                                <option value="finished">Finished</option>
                            </select>
                        </div>
                    </div>

                    {/* Liste des interventions */}
                    <div className="grid grid-cols-1 gap-4">
                        {filteredInterventions.length > 0 ? (
                            filteredInterventions.map((intervention) => (
                                <div
                                    key={intervention.id}
                                    className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                                        expandedInterventionId === intervention.id
                                            ? 'border-blue-300 shadow-lg'
                                            : 'border-gray-200 hover:border-blue-200'
                                    }`}
                                    onClick={() => {
                                        setExpandedInterventionId(prev =>
                                            prev === intervention.id ? null : intervention.id
                                        );
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-800">
                                                {intervention.typeintervention}
                                            </h3>
                                            <p className="text-sm text-gray-600 flex items-center mt-1">
                                                <FaCalendarAlt className="mr-2 text-blue-400" />
                                                {new Date(intervention.datedemand).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600 flex items-center">
                                                <FaUser className="mr-2 text-blue-400" />
                                                {intervention.user.fname} {intervention.user.lname}
                                            </p>
                                            <p className="text-sm text-gray-600 flex items-center mt-1">
                                                <FaCar className="mr-2 text-blue-400" />
                                                {intervention.car.carname} - {intervention.car.immatriculation}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div>
                                            {intervention.status === "in progress" ? (
                                                <div className="flex items-center space-x-2">
                                                    <FaSpinner className="animate-spin text-blue-500" />
                                                    <span className="text-blue-500 font-semibold">in Progress</span>
                                                </div>
                                            ) : intervention.status === "finished" ? (
                                                <div className="flex items-center space-x-2">
                                                    <FontAwesomeIcon icon={faCircleCheck} size="lg" className="text-green-500" />
                                                    <span className="text-green-500 font-semibold">Finished</span>
                                                </div>
                                            ) : (
                                                <span className="bg-yellow-500 text-white px-3 py-1 rounded-lg">Initio</span>
                                            )}
                                        </div>
                                        {intervention.status === "initio" && (
                                            <button
                                                onClick={() => startIntervention(intervention.id, intervention.user.id, intervention.car.id)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition"
                                            >
                                                Start
                                            </button>
                                        )}
                                    </div>
                                    {expandedInterventionId === intervention.id && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-slideDown">
                                            <h4 className="text-sm font-semibold text-gray-600 mb-2">
                                                Description :
                                            </h4>
                                            <p className="text-gray-700 leading-relaxed">
                                                {intervention.description || "No description"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                No Intervention Found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminIntervention;