import React, { useState, useEffect } from "react";
import AdminNavigation from "../../components/admin/AdminNavigation.jsx";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import api from "../../services/axios.js";

const UserCarList = () => {
  // États pour la liste des voitures
  const [cars, setCars] = useState([]);
  const token = localStorage.getItem("token");

  // États pour le formulaire et le modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [interventionData, setInterventionData] = useState({
    typeintervention: "",
    description: "",
    localisation: "",
  });
  const [error, setError] = useState("");

  // Récupération des voitures au chargement
  useEffect(() => {
    api
      .get("cars", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data.data);
        setCars(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Gestion du clic sur "Demander"
  const handleRequestIntervention = (carId) => {
    setSelectedCarId(carId);
    setInterventionData({
      typeintervention: "",
      description: "",
      localisation: "",
    });
    setError("");
    setIsModalOpen(true);
  };

  // Gestion des changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInterventionData((prev) => ({ ...prev, [name]: value }));
  };

  // Gestion de l’envoi de la demande
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Récupérer l’ID de l’utilisateur connecté
      const userResponse = await api.get("/userProfile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userId = userResponse.data.id;

      // Envoyer la requête d’intervention
      const response = await api.post(
        "/interventions",
        {
          user_id: userId,
          car_id: selectedCarId,
          typeintervention: interventionData.typeintervention,
          datedemand: new Date().toISOString().split("T")[0], // Date actuelle
          status: "Demande", // Statut automatique
          description: interventionData.description || null,
          localisation: interventionData.localisation || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Intervention envoyée :", response.data);
      setIsModalOpen(false); // Ferme le modal après succès
    } catch (err) {
      console.error("Erreur lors de l’envoi :", err.response?.data);
      setError(
        err.response?.data?.message || "Erreur lors de l’envoi de la demande"
      );
    }
  };

  // Rendu
  return (
    <div>
      <AdminNavigation />
      <AdminHeader />
      <div className="ml-60 p-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Liste des voitures
        </h2>
        {cars.length > 0 ? (
          <table className="min-w-full table-auto border-collapse rounded-lg shadow-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-6 py-3 text-left">Nom de la voiture</th>
                <th className="px-6 py-3 text-left">Immatriculation</th>
                <th className="px-6 py-3 text-left">Marque</th>
                <th className="px-6 py-3 text-left">Client</th>
                <th className="px-6 py-3 text-left">Action</th>
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
                  <td className="px-6 py-4 border-b">
                    {car.user?.fname || "Inconnu"}
                  </td>
                  <td className="px-6 py-4 border-b text-center">
                    <button
                      onClick={() => handleRequestIntervention(car.id)}
                      className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition-colors"
                    >
                      Demander
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-700">Loading...User</p>
        )}
      </div>

      {/* Modal pour le formulaire d’intervention */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Demande d’intervention</h3>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">
                  Type d’intervention
                </label>
                <input
                  type="text"
                  name="typeintervention"
                  value={interventionData.typeintervention}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
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
                  className="bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
                >
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCarList;
