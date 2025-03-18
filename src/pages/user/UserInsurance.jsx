import { useState, useEffect } from "react";
import UserNavigation from "../../components/user/UserNavigation.jsx";
import UserHeader from "../../components/user/UserHeader.jsx";
import api from "../../services/axios";

const UserInsurance = () => {
    const today = new Date().toISOString().split("T")[0];
    const [typeinsurance, setTypeInsurance] = useState("");
    const [startdate, setStartDate] = useState(today);
    const [enddate, setEndDate] = useState("");
    const [insuranceprice, setInsurancePrice] = useState("");
    const [carId, setCarId] = useState("");
    const [cars, setCars] = useState([]);
    const [errors, setErrors] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const insuranceOptions = [
        { label: "1 mois", value: "1 mois", price: 200000, months: 1 },
        { label: "2 mois", value: "2 mois", price: 400000, months: 2 },
        { label: "3 mois", value: "3 mois", price: 600000, months: 3 },
        { label: "4 mois", value: "4 mois", price: 800000, months: 4 },
        { label: "5 mois", value: "5 mois", price: 1000000, months: 5 },
        { label: "12 mois", value: "12 mois", price: 2400000, months: 12 },
    ];

    // Récupérer les voitures de l’utilisateur
    useEffect(() => {
        const fetchCars = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setErrors("Vous devez être connecté.");
                return;
            }
            try {
                const response = await api.get("/cars", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCars(response.data.data || []);
            } catch (error) {
                console.error("Erreur lors de la récupération des voitures :", error);
                setErrors("Erreur lors du chargement des voitures.");
            }
        };
        fetchCars();
    }, []);

    const handleTypeChange = (e) => {
        const selectedType = e.target.value;
        setTypeInsurance(selectedType);

        const selectedOption = insuranceOptions.find(
            (option) => option.value === selectedType
        );
        if (selectedOption) {
            setInsurancePrice(selectedOption.price);
            const start = new Date(startdate);
            const monthsToAdd = selectedOption.months;
            const end = new Date(start.setMonth(start.getMonth() + monthsToAdd));
            setEndDate(end.toISOString().split("T")[0]);
        } else {
            setInsurancePrice("");
            setEndDate("");
        }
    };

    const handleAddInsurance = async (e) => {
        e.preventDefault();
        setErrors("");
        setSuccessMessage("");

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setErrors("Vous devez être connecté pour ajouter une assurance.");
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

            if (!carId) {
                setErrors("Veuillez sélectionner une voiture.");
                return;
            }

            const insuranceData = {
                user_id: currentUserId,
                car_id: carId,
                typeinsurance,
                startdate,
                enddate,
                insuranceprice: insuranceprice ? parseInt(insuranceprice) : null,
            };
            console.log("Données envoyées au backend :", insuranceData); // Débogage

            const response = await api.post("/insurances", insuranceData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200 || response.status === 201) {
                setSuccessMessage("Assurance ajoutée avec succès !");
                setTypeInsurance("");
                setStartDate(today);
                setEndDate("");
                setInsurancePrice("");
                setCarId("");
            }
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setErrors(
                    "Vérifiez les champs saisis : " +
                    JSON.stringify(err.response.data.Message)
                );
            } else {
                setErrors(
                    err.response?.data?.message ||
                    "Erreur lors de l'ajout de l'assurance."
                );
            }
            console.error("Erreur :", err.response?.data);
        }
    };

    return (
        <div>
            <UserNavigation />
            <UserHeader />
            <div className="ml-64 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Ajouter une assurance
                </h2>

                {errors && (
                    <p className="text-red-600 bg-red-100 p-3 rounded-md mb-4">
                        {errors}
                    </p>
                )}
                {successMessage && (
                    <p className="text-green-600 bg-green-100 p-3 rounded-md mb-4">
                        {successMessage}
                    </p>
                )}

                <form onSubmit={handleAddInsurance} className="space-y-5 max-w-lg">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Voiture
                        </label>
                        <select
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={carId}
                            onChange={(e) => setCarId(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                Sélectionnez une voiture
                            </option>
                            {cars.map((car) => (
                                <option key={car.id} value={car.id}>
                                    {car.carname} ({car.immatriculation})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Type d'assurance
                        </label>
                        <select
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={typeinsurance}
                            onChange={handleTypeChange}
                            required
                        >
                            <option value="" disabled>
                                Sélectionnez un type
                            </option>
                            {insuranceOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Date de début
                        </label>
                        <input
                            type="date"
                            className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
                            value={startdate}
                            readOnly
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Date de fin
                        </label>
                        <input
                            type="date"
                            className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
                            value={enddate}
                            readOnly
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Prix de l'assurance (Ar)
                        </label>
                        <input
                            type="number"
                            className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
                            value={insuranceprice}
                            readOnly
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
                    >
                        Ajouter l'assurance
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserInsurance;
