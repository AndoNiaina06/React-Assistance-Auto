import React, { useEffect, useState } from "react";
import { FaSearch, FaUser, FaCar, FaCalendarAlt, FaFileInvoiceDollar } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCircleCheck, faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import AdminNavigation from "../../components/admin/AdminNavigation.jsx";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import api from "../../services/axios.js";

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts._pdfMakePages;

const AdminInsurance = () => {
    //State
    const [insurances, setInsurances] = useState([]);
    const [filteredInsurances, setFilteredInsurances] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [expandedInsuranceId, setExpandedInsuranceId] = useState(null);

    //comportement
    useEffect(() => {
        const token = localStorage.getItem("token");
        api.get("insurances", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                setInsurances(response.data.data);
                setFilteredInsurances(response.data.data);
            })
            .catch((error) => {
                console.error("Erreur lors du chargement des assurances:", error);
            });
    }, []);

    useEffect(() => {
        let filtered = insurances;

        if (statusFilter !== "all") {
            filtered = filtered.filter(insurance => insurance.status === statusFilter);
        }

        if (typeFilter !== "all") {
            filtered = filtered.filter(insurance => insurance.typeinsurance === typeFilter);
        }

        if (search) {
            filtered = filtered.filter(insurance =>
                insurance.user.fname.toLowerCase().includes(search.toLowerCase()) ||
                insurance.user.lname.toLowerCase().includes(search.toLowerCase()) ||
                insurance.car.carname.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredInsurances(filtered);
    }, [statusFilter, typeFilter, search, insurances]);

    const getUniqueInsuranceTypes = () => {
        const types = [...new Set(insurances.map(insurance => insurance.typeinsurance))];
        return types.filter(type => type); // Retire les valeurs null/undefined
    };

    const generateInsurancePDF = (insurance) => {
        try {
            console.log('Données assurance:', insurance);

            const userEmail = insurance.user?.email || 'Non renseigné';
            const carMarque = insurance.car?.marque || 'Non renseigné';

            // Définir le contenu du PDF
            const docDefinition = {
                content: [
                    { text: 'Insurance Certificate', style: 'header' },
                    { text: `Client: ${insurance.user.fname} ${insurance.user.lname}`, margin: [0, 10, 0, 0] },
                    { text: `Email: ${userEmail}`, margin: [0, 0, 0, 10] },
                    { text: `Vehicle: ${carMarque}`, margin: [0, 0, 0, 10] },
                    { text: `Immatriculation: ${insurance.car.immatriculation}`, margin: [0, 0, 0, 20] },
                    {
                        table: {
                            headerRows: 1,
                            widths: ['*', '*'],
                            body: [
                                [{ text: 'Detail', style: 'tableHeader' }, { text: 'Value', style: 'tableHeader' }],
                                ['Type', insurance.typeinsurance],
                                ['Start Date', new Date(insurance.startdate).toLocaleDateString()],
                                ['End Date', new Date(insurance.enddate).toLocaleDateString()],
                                ['Price', `${insurance.insuranceprice} €`],
                                ['Status', 'Validated']
                            ]
                        },
                        layout: 'lightHorizontalLines' // Option de mise en page
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

            // Générer et sauvegarder le PDF
            pdfMake.createPdf(docDefinition).download(`insurance_${insurance.id}_certificate.pdf`);
        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
        }
    };


    const validateInsurance = (insurance) => {
        const token = localStorage.getItem("token");
        api.put(`insurances/${insurance.id}`, {
            status: "valide",
            user_id: insurance.user.id,
            car_id: insurance.car.id,
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                setInsurances(insurances.map(i =>
                    i.id === insurance.id ? { ...insurance, status: "valide" } : i
                ));
                generateInsurancePDF(insurance); // Génération du PDF après validation
            })
            .catch((error) => {
                console.error("Erreur lors de la validation de l'assurance:", error);
            });
    };


    //render

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
                            List of Insurances
                        </h1>
                        <div className="flex gap-4 flex-wrap">
                            <div className="relative flex-1 max-w-md">
                                <FaSearch className="absolute top-4 left-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search insurance..."
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
                                <option value="initio">Initio</option>
                                <option value="valide">Valide</option>
                                <option value="expired">Expired</option>
                            </select>
                            <select
                                className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-300"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="all">All Types</option>
                                {getUniqueInsuranceTypes().map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Liste des assurances */}
                    <div className="grid grid-cols-1 gap-4">
                        {filteredInsurances.length > 0 ? (
                            filteredInsurances.map((insurance) => (
                                <div
                                    key={insurance.id}
                                    className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                                        expandedInsuranceId === insurance.id
                                            ? 'border-blue-300 shadow-lg'
                                            : 'border-gray-200 hover:border-blue-200'
                                    }`}
                                    onClick={() => {
                                        setExpandedInsuranceId(prev =>
                                            prev === insurance.id ? null : insurance.id
                                        );
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-800">
                                                {insurance.typeinsurance}
                                            </h3>
                                            <p className="text-sm text-gray-600 flex items-center mt-1">
                                                <FaCalendarAlt className="mr-2 text-blue-400" />
                                                {new Date(insurance.startdate).toLocaleDateString()} - {new Date(insurance.enddate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600 flex items-center">
                                                <FaUser className="mr-2 text-blue-400" />
                                                {insurance.user.fname} {insurance.user.lname}
                                            </p>
                                            <p className="text-sm text-gray-600 flex items-center mt-1">
                                                <FaCar className="mr-2 text-blue-400" />
                                                {insurance.car.carname} - {insurance.car.immatriculation}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div>
                                            {insurance.status === "valide" ? (
                                                <div className="flex items-center space-x-2">
                                                    <FontAwesomeIcon icon={faCircleCheck} size="lg" className="text-green-500" />
                                                    <span className="text-green-500 font-semibold">valide</span>
                                                </div>
                                            ) : insurance.status === "expired" ? (
                                                <div className="flex items-center space-x-2">
                                                    <FontAwesomeIcon icon={faCircleExclamation} size="lg" className="text-red-500" />
                                                    <span className="text-red-500 font-semibold">Expired</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-4">
                                                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-lg">Initio</span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            validateInsurance(insurance);
                                                        }}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition"
                                                    >
                                                        Validate
                                                    </button>
                                                </div>                                            )}
                                        </div>
                                        <div className="text-lg font-bold text-blue-600">
                                            {insurance.insuranceprice}  Ar TTC
                                        </div>
                                    </div>
                                    {expandedInsuranceId === insurance.id && (
                                        <div className="mt-4 p-4 bg-gray-200 rounded-lg animate-slideDown">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-600 mb-2">Détails :</h4>
                                                    <p className="text-gray-700">
                                                        Mark: {insurance.car.marque}<br/>
                                                        Immatriculation: {insurance.car.immatriculation}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-600 mb-2">Peiod :</h4>
                                                    <p className="text-gray-700">
                                                        Start: {new Date(insurance.startdate).toLocaleDateString()}<br/>
                                                        End: {new Date(insurance.enddate).toLocaleDateString()}<br/>
                                                        During: {Math.floor((new Date(insurance.enddate) - new Date(insurance.startdate)) / (1000 * 60 * 60 * 24))} Days
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                No Insurance Found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminInsurance;