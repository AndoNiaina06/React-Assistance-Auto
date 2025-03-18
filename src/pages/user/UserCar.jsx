import React, { useState, useEffect } from "react";
import UserNavigation from "../../components/user/UserNavigation.jsx";
import UserHeader from "../../components/user/UserHeader.jsx";
import { FaCar, FaTag } from "react-icons/fa";
import api from "../../services/axios.js";

const UserCar = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [carname, setCarName] = useState("");
    const [immatriculation, setImmatriculation] = useState("");
    const [marque, setMarque] = useState("");
    const [marquePersonnalisee, setMarquePersonnalisee] = useState("");
    const [errors, setErrors] = useState("");
    const [validationErrors, setValidationErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCarId, setSelectedCarId] = useState(null);
    const [interventionData, setInterventionData] = useState({
        typeintervention: "",
        customType: "",
        description: "",
        localisation: "",
    });
    const [interventionError, setInterventionError] = useState("");

    const marquesDisponibles = [
        "Peugeot",
        "Renault",
        "Citroën",
        "Volkswagen",
        "Toyota",
        "BMW",
        "Mercedes",
        "Ford",
        "Honda",
        "Audi",
        "Autre",
    ];

    const interventionTypes = [
        "Panne moteur",
        "Pneu crevé",
        "Remorquage",
        "Panne batterie",
        "Vidange huile",
        "Collision légère",
        "Problème freins",
        "Dépannage sur place",
        "Autre",
    ];

    useEffect(() => {
        const fetchCars = async () => {
            if (!token) {
                setErrors("Vous devez être connecté.");
                return;
            }
            try {
                const response = await api.get("/cars", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCars(response.data.data || []);
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors du chargement des voitures :", error);
                setErrors("Erreur lors du chargement des voitures.");
                setLoading(false);
            }
        };
        fetchCars();
    }, [token]);

    const handleAddCar = async (e) => {
        e.preventDefault();
        setErrors("");
        setValidationErrors({});
        setSuccessMessage("");

        try {
            if (!token) {
                setErrors("Vous devez être connecté pour ajouter une voiture.");
                return;
            }

            let currentUserId;
            try {
                const response = await api.get("/userProfile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                currentUserId = response.data.id;
            } catch (error) {
                console.error(
                    "Erreur lors de la récupération du profil utilisateur",
                    error
                );
                setErrors(
                    "Impossible de récupérer votre profil. Veuillez vous reconnecter."
                );
                return;
            }

            const marqueFinale = marque === "Autre" ? marquePersonnalisee : marque;

            const response = await api.post(
                "/cars",
                {
                    user_id: currentUserId,
                    carname,
                    immatriculation,
                    marque: marqueFinale,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200 || response.status === 201) {
                setSuccessMessage("Voiture ajoutée avec succès !");
                setCars((prevCars) => [
                    ...prevCars,
                    response.data.data || response.data,
                ]);
                setCarName("");
                setImmatriculation("");
                setMarque("");
                setMarquePersonnalisee("");
                setTimeout(() => {
                    setSuccessMessage("");
                    setIsFormOpen(false);
                }, 2000);
            }
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setValidationErrors(
                    err.response.data.errors || err.response.data.Message || {}
                );
                setErrors("Vérifiez les champs saisis.");
            } else {
                setErrors(
                    err.response?.data?.message || "Erreur lors de l'ajout de la voiture."
                );
            }
        }
    };

    const handleRequestIntervention = (carId) => {
        setSelectedCarId(carId);
        setInterventionData({
            typeintervention: "",
            customType: "",
            description: "",
            localisation: "",
        });
        setInterventionError("");
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInterventionData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitIntervention = async (e) => {
        e.preventDefault();
        setInterventionError("");

        try {
            // Récupérer l'utilisateur
            const userResponse = await api.get("/userProfile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const userId = userResponse.data.id;

            // Vérifier si la voiture a une assurance non expirée
            const insuranceResponse = await api.get(`/insurances?car_id=${selectedCarId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const activeInsurance = insuranceResponse.data.data?.find(
                (insurance) => new Date(insurance.enddate) >= new Date()
            );

            if (!activeInsurance) {
                setInterventionError("Cette voiture n’a pas d’assurance active ou elle est expirée. Ajoutez ou renouvelez une assurance.");
                return;
            }

            // Déterminer le type d'intervention final
            const finalTypeIntervention =
                interventionData.typeintervention === "Autre"
                    ? interventionData.customType
                    : interventionData.typeintervention;

            if (!finalTypeIntervention) {
                setInterventionError("Veuillez spécifier un type d’intervention.");
                return;
            }

            // Envoyer la demande
            const response = await api.post(
                "/interventions",
                {
                    user_id: userId,
                    car_id: selectedCarId,
                    typeintervention: finalTypeIntervention,
                    datedemand: new Date().toISOString().split("T")[0],
                    status: "Demande",
                    description: interventionData.description || null,
                    localisation: interventionData.localisation || null,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            console.log("Intervention envoyée :", response.data);
            setIsModalOpen(false);
        } catch (err) {
            console.error("Erreur lors de l’envoi :", err.response?.data);
            setInterventionError(
                err.response?.data?.message || "Erreur lors de l’envoi de la demande"
            );
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const inputVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    };

    return (
        <div>
            <UserNavigation />
            <UserHeader />
            <div className="ml-60 p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Mes voitures</h2>

                {/* Titre et bouton "Ajouter" alignés */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                        Liste des voitures
                    </h3>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-blue-500 text-white font-semibold py-1.5 px-3 rounded-lg hover:bg-blue-800 transition-colors"
                    >
                        Ajouter une voiture
                    </button>
                </div>

                {/* Formulaire d'ajout */}
                {isFormOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                        <motion.div
                            className="bg-white p-4 rounded-xl shadow-xl w-96 border border-gray-200/50"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <h3 className="text-lg font-semibold mb-3 text-gray-800">
                                Ajouter une voiture
                            </h3>
                            {errors && (
                                <motion.p
                                    className="text-red-500 text-center mb-2 text-sm"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {errors}
                                </motion.p>
                            )}
                            {successMessage && (
                                <motion.p
                                    className="text-green-500 text-center mb-2 text-sm"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {successMessage}
                                </motion.p>
                            )}
                            <form onSubmit={handleAddCar} className="space-y-3">
                                <motion.div variants={inputVariants}>
                                    <div className="relative">
                                        <FaCar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Car Name (Ex: Ford Ranger)"
                                            className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-500 text-sm"
                                            value={carname}
                                            onChange={(e) => setCarName(e.target.value)}
                                            required
                                        />
                                        {validationErrors.carname && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {validationErrors.carname[0]}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                                <motion.div variants={inputVariants}>
                                    <div className="relative">
                                        <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Immatriculation (Ex: 43476WWT)"
                                            className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-500 text-sm"
                                            value={immatriculation}
                                            onChange={(e) => setImmatriculation(e.target.value)}
                                            required
                                        />
                                        {validationErrors.immatriculation && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {validationErrors.immatriculation[0]}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                                <motion.div variants={inputVariants}>
                                    <div className="relative">
                                        <FaCar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <select
                                            className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-500 text-sm"
                                            value={marque}
                                            onChange={(e) => setMarque(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>
                                                Select a brand
                                            </option>
                                            {marquesDisponibles.map((marqueOption) => (
                                                <option key={marqueOption} value={marqueOption}>
                                                    {marqueOption}
                                                </option>
                                            ))}
                                        </select>
                                        {validationErrors.marque && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {validationErrors.marque[0]}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                                {marque === "Autre" && (
                                    <motion.div variants={inputVariants}>
                                        <div className="relative">
                                            <FaCar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Marque personnalisée"
                                                className="w-full pl-10 p-2 border border-blue-800 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-500 text-sm"
                                                value={marquePersonnalisee}
                                                onChange={(e) => setMarquePersonnalisee(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </motion.div>
                                )}
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsFormOpen(false)}
                                        className="bg-gray-300 text-gray-700 rounded-lg px-3 py-1 text-sm hover:bg-white-400 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <motion.button
                                        type="submit"
                                        className="bg-blue-500 text-white rounded-lg px-3 py-1 text-sm "
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Ajouter
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* Liste des voitures */}
                <div
                    className={`transition-all ${
                        isFormOpen ? "backdrop-blur-sm brightness-75" : ""
                    }`}
                >
                    {loading ? (
                        <p className="text-gray-700 text-sm">Chargement...</p>
                    ) : cars.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg shadow-sm border border-gray-100">
                                <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium text-sm rounded-tl-lg">
                                        Nom
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium text-sm">
                                        Immatriculation
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium text-sm">
                                        Marque
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium text-sm rounded-tr-lg">
                                        Action
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {cars.map((car) => (
                                    <tr
                                        key={car.id}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <td className="px-4 py-2 text-gray-800 text-sm">
                                            {car.carname}
                                        </td>
                                        <td className="px-4 py-2 text-gray-800 text-sm">
                                            {car.immatriculation}
                                        </td>
                                        <td className="px-4 py-2 text-gray-800 text-sm">
                                            {car.marque}
                                        </td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => handleRequestIntervention(car.id)}
                                                className="bg-blue-500 text-white rounded-lg px-3 py-1 text-sm hover:bg-blue-600 transition-colors"
                                            >
                                                Demander
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-700 text-sm">Aucune voiture trouvée.</p>
                    )}
                </div>

                {/* Modal pour le formulaire d’intervention */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h3 className="text-xl font-bold mb-4">Demande d’intervention</h3>
                            {interventionError && (
                                <p className="text-red-500 mb-4">{interventionError}</p>
                            )}
                            <form onSubmit={handleSubmitIntervention} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700">
                                        Type d’intervention
                                    </label>
                                    <select
                                        name="typeintervention"
                                        value={interventionData.typeintervention}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md"
                                        required
                                    >
                                        <option value="" disabled>
                                            Sélectionnez un type
                                        </option>
                                        {interventionTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {interventionData.typeintervention === "Autre" && (
                                    <div>
                                        <label className="block text-gray-700">
                                            Type personnalisé
                                        </label>
                                        <input
                                            type="text"
                                            name="customType"
                                            value={interventionData.customType}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded-md"
                                            required
                                            placeholder="Entrez un type personnalisé"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-gray-700">Description</label>
                                    <textarea
                                        name="description"
                                        value={interventionData.description}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Localisation</label>
                                    <input
                                        type="text"
                                        name="localisation"
                                        value={interventionData.localisation}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-gray-300 text-gray-700 rounded-md px-4 py-2"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-700 text-white rounded-md px-4 py-2 hover:bg-blue-600"
                                    >
                                        Envoyer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserCar;