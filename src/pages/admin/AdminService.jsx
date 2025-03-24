import React, { useEffect, useState } from "react";
import { FaSearch, FaCar, FaCalendarAlt, FaFileInvoiceDollar } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import AdminNavigation from "../../components/admin/AdminNavigation.jsx";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import api from "../../services/axios.js";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake;

const AdminService = () => {
    // State
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [expandedServiceId, setExpandedServiceId] = useState(null);

    // Comportement
    useEffect(() => {
        const token = localStorage.getItem("token");
        api.get("services", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                setServices(response.data.data);
                setFilteredServices(response.data.data);
            })
            .catch((error) => {
                console.error("Erreur lors du chargement des services:", error);
            });
    }, []);

    useEffect(() => {
        let filtered = services;

        if (statusFilter !== "all") {
            filtered = filtered.filter(service => service.status === statusFilter);
        }

        if (typeFilter !== "all") {
            filtered = filtered.filter(service => service.typeservice === typeFilter);
        }

        if (search) {
            filtered = filtered.filter(service =>
                service.car.carname.toLowerCase().includes(search.toLowerCase()) ||
                service.car.immatriculation.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredServices(filtered);
    }, [statusFilter, typeFilter, search, services]);

    const getUniqueServiceTypes = () => {
        const types = [...new Set(services.map(service => service.typeservice))];
        return types.filter(type => type); // Retire les valeurs null
    };
    const confirmService = (service) => {
        const token = localStorage.getItem("token");
        api.put(`services/${service.id}`, {
            status: "payed",
            car_id: service.car_id,
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                setServices(services.map(s =>
                    s.id === service.id ? { ...service, status: "payed" } : s
                ));
                generateServicePDF(service); // Générer le PDF après confirmation
            })
            .catch((error) => {
                console.error("Erreur lors de la confirmation du service:", error);
            });
    };
    const generateServicePDF = (service) => {
        const docDefinition = {
            content: [
                { text: 'Service Confirmation', style: 'header' },
                { text: `Service Type: ${service.typeservice}`, margin: [0, 10, 0, 0] },
                { text: `Vehicle: ${service.car.carname}`, margin: [0, 0, 0, 10] },
                { text: `Immatriculation: ${service.car.immatriculation}`, margin: [0, 0, 0, 20] },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*'],
                        body: [
                            [{ text: 'Detail', style: 'tableHeader' }, { text: 'Value', style: 'tableHeader' }],
                            ['Date', new Date(service.dateservice).toLocaleDateString()],
                            ['Cost', `${service.cout} Ar`],
                            ['Status', 'Payed']
                        ]
                    },
                    layout: 'lightHorizontalLines'
                },
                { text: 'Authorized Signature: ___________________________', margin: [0, 20, 0, 0] }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 20]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 12,
                    color: 'white',
                    fillColor: '#2980b9'
                }
            }
        };

        pdfMake.createPdf(docDefinition).download(`service_${service.id}_confirmation.pdf`);
    };

    // Render
    return (
        <div>
            <AdminNavigation />
            <AdminHeader />

            <div className="ml-64 mt-6 mr-6 p-8 bg-gray-100">
                <div className="bg-white p-6 rounded-2xl shadow-xl">
                    {/* En-tête et filtres */}
                    <div className="mb-8 border-b border-gray-200 pb-6">
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-4">
                            <FaFileInvoiceDollar className="mr-3 text-blue-500" />
                            List of Services
                        </h1>
                        <div className="flex gap-4 flex-wrap">
                            <div className="relative flex-1 max-w-md">
                                <FaSearch className="absolute top-4 left-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search service..."
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
                                <option value="all">all</option>
                                <option value="initio">Demand</option>
                                <option value="payed">Payed</option>
                            </select>
                            <select
                                className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-300"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="all">All Types</option>
                                {getUniqueServiceTypes().map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Liste des services */}
                    <div className="grid grid-cols-1 gap-4">
                        {filteredServices.length > 0 ? (
                            filteredServices.map((service) => (
                                <div
                                    key={service.id}
                                    className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                                        expandedServiceId === service.id
                                            ? 'border-blue-300 shadow-lg'
                                            : 'border-gray-200 hover:border-blue-200'
                                    }`}
                                    onClick={() => {
                                        setExpandedServiceId(prev =>
                                            prev === service.id ? null : service.id
                                        );
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-800">
                                                {service.typeservice}
                                            </h3>
                                            <p className="text-sm text-gray-600 flex items-center mt-1">
                                                <FaCalendarAlt className="mr-2 text-blue-400" />
                                                {new Date(service.dateservice).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600 flex items-center">
                                                <FaCar className="mr-2 text-blue-400" />
                                                {service.car.carname} - {service.car.immatriculation}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div>
                                            {service.status === "finished" ? (
                                                <div className="flex items-center space-x-2">
                                                    <FontAwesomeIcon icon={faCircleCheck} size="lg" className="text-green-500" />
                                                    <span className="text-green-500 font-semibold">Completed</span>
                                                </div>
                                            ) : service.status === "payed" ? (
                                                <div className="flex items-center space-x-2">
                                                    <FontAwesomeIcon icon={faCircleCheck} size="lg" className="text-blue-500" />
                                                    <span className="text-blue-500 font-semibold">Payed</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-4">
                                                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-lg">Initio</span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Empêche l'expansion du service
                                                            confirmService(service);
                                                        }}
                                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition"
                                                    >
                                                        Confirm
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-lg font-bold text-blue-600">
                                            {service.cout} Ar TTC
                                        </div>
                                    </div>
                                    {expandedServiceId === service.id && (
                                        <div className="mt-4 p-4 bg-gray-200 rounded-lg animate-slideDown">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-600 mb-2">Détails :</h4>
                                                    <p className="text-gray-700">
                                                        Marque: {service.car.marque}<br/>
                                                        Immatriculation: {service.car.immatriculation}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-600 mb-2">Date :</h4>
                                                    <p className="text-gray-700">
                                                        {new Date(service.dateservice).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                No Service Found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminService;