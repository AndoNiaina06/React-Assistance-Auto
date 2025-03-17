import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import AdminNavigation from "../../components/admin/AdminNavigation.jsx";
import api from "../../services/axios.js";
import { FaUser, FaSearch, FaIdCard, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const AdminCustomer = () => {
    // State
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCustomer, setSelectedCustomer]    = useState(null);

    // Comportement
    useEffect(() => {
        const token = localStorage.getItem("token");
        api.get("users-with-cars", { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setCustomers(response.data))
            .catch(console.error);
    }, []);

    // Filtrage des utilisateurs
    const filteredCustomers = customers.filter(customer =>
        [customer.fname, customer.lname, customer.email].some(field =>
            field.toLowerCase().includes(search.toLowerCase())
        )
    );

    // Render
    return (
        <div>
            <AdminNavigation />
            <AdminHeader />

            <div className="ml-64 mt-6 mr-6 p-8 bg-gray-100">
                <div className="bg-white p-6 rounded-2xl shadow-xl">
                    {/* En-tête et recherche */}
                    <div className="mb-8 border-b border-gray-200 pb-6">
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-4">
                            <FaUser className="mr-3 text-blue-500" />
                            List of Customers
                        </h1>
                        <div className="relative max-w-md">
                            <FaSearch className="absolute top-4 left-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search Customers..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                    </div>

                    {/* Contenu principal */}
                    <div className="flex gap-8">
                        {/* Liste des clients */}
                        <div className="flex-1">
                            <div className="grid grid-cols-1 gap-4">
                                {filteredCustomers.map(customer => (
                                    <div
                                        key={customer.id}
                                        onClick={() => setSelectedCustomer(customer)}
                                        className={`p-4 rounded-xl border transition-all cursor-pointer
                                            ${selectedCustomer?.id === customer.id
                                            ? 'border-blue-300 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-200'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-800">
                                                    {customer.fname} {customer.lname}
                                                </h3>
                                                <p className="text-sm text-gray-600 flex items-center mt-1">
                                                    <FaEnvelope className="mr-2 text-blue-400" />
                                                    {customer.email}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                    {customer.cars_count} Car(s)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Détails du client */}
                        {selectedCustomer && (
                            <div className="w-96 bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4">
                                        <FaIdCard className="mr-2 text-blue-500" />
                                        Customer Info
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Full Name</label>
                                            <p className="mt-1 p-2 bg-white rounded-lg">
                                                {selectedCustomer.fname} {selectedCustomer.lname}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Email</label>
                                            <p className="mt-1 p-2 bg-white rounded-lg flex items-center">
                                                <FaEnvelope className="mr-2 text-blue-400" />
                                                {selectedCustomer.email}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Address</label>
                                            <p className="mt-1 p-2 bg-white rounded-lg flex items-center">
                                                <FaMapMarkerAlt className="mr-2 text-blue-400" />
                                                {selectedCustomer.address || "Non renseignée"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    {selectedCustomer.cars?.length > 0 ? (
                                        <div className="space-y-3">
                                            {selectedCustomer.cars.map((car, index) => (
                                                <div key={index} className="p-3 bg-white rounded-lg border border-gray-200">
                                                    <p className="font-medium text-gray-800">{car.carname}</p>
                                                    <p className="text-sm text-gray-600">{car.marque}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">
                                            no car saved
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {!selectedCustomer && (
                        <div className="text-center py-12 text-gray-500">
                            Select one client to view details
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminCustomer;