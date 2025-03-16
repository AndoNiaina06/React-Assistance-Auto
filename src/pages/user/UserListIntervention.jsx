import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavigation from "../../components/user/UserNavigation.jsx";
import AdminHeader from "../../components/user/UserHeader.jsx";
import api from "../../services/axios.js";
import { FaCheck, FaTimes } from "react-icons/fa";

const UserListIntervention = () => {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fonction pour récupérer et trier les interventions
  const fetchInterventions = async () => {
    if (!token) {
      setError("Vous devez être connecté.");
      navigate("/");
      return;
    }

    try {
      const response = await api.get("/interventions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Interventions chargées :", response.data.data);

      const filteredAndSortedInterventions = (response.data.data || [])
        .filter((intervention) => intervention.status !== "refusé")
        .sort((a, b) => {
          if (a.status === "Demande" && b.status !== "Demande") return -1;
          if (a.status !== "Demande" && b.status === "Demande") return 1;
          return 0;
        });

      setInterventions(filteredAndSortedInterventions);
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors du chargement :", err.response?.data);
      if (err.response?.status === 401) {
        setError("Session expirée. Veuillez vous reconnecter.");
        localStorage.removeItem("token");
        navigate("/");
      } else {
        setError(
          err.response?.data?.message ||
            "Erreur lors du chargement des interventions."
        );
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterventions(); // Chargement initial

    // Polling toutes les 10 secondes pour les nouvelles interventions
    const interval = setInterval(() => {
      fetchInterventions();
    }, 10000); // 10000 ms = 10 secondes

    // Nettoyage de l'intervalle quand le composant est démonté
    return () => clearInterval(interval);
  }, [token, navigate]);

  const updateInterventionStatus = async (id, newStatus) => {
    if (!token) {
      setError("Vous devez être connecté.");
      navigate("/");
      return;
    }

    const confirmationMessage =
      newStatus === "Terminer"
        ? "Êtes-vous sûr de vouloir accepter cette intervention ?"
        : "Êtes-vous sûr de vouloir décliner cette intervention ?";
    if (!window.confirm(confirmationMessage)) {
      return;
    }

    try {
      const response = await api.put(
        `/interventions/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(`Intervention ${id} mise à jour :`, response.data);

      // Mettre à jour et retrier les interventions
      setInterventions((prev) => {
        const updatedInterventions = prev
          .map((intervention) =>
            intervention.id === id
              ? { ...intervention, status: newStatus }
              : intervention
          )
          .filter((intervention) => intervention.status !== "refusé");

        // Retrier après mise à jour
        return updatedInterventions.sort((a, b) => {
          if (a.status === "Demande" && b.status !== "Demande") return -1;
          if (a.status !== "Demande" && b.status === "Demande") return 1;
          return 0;
        });
      });
      setError("");
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err.response?.data);
      if (err.response?.status === 401) {
        setError("Session expirée. Veuillez vous reconnecter.");
        localStorage.removeItem("token");
        navigate("/");
      } else {
        setError(
          err.response?.data?.message ||
            "Erreur lors de la mise à jour du statut."
        );
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-blue-50 min-h-screen">
      <AdminNavigation />
      <AdminHeader />
      <div className="ml-60 p-10">
        <h2 className="text-3xl font-extrabold mb-8 text-gray-800 tracking-tight">
          Liste des Interventions
        </h2>

        {error && (
          <p className="text-red-500 bg-red-100 p-3 rounded-lg mb-6 shadow-md">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-gray-600 italic animate-pulse">
            Chargement des interventions...
          </p>
        ) : interventions.length > 0 ? (
          <div className="overflow-x-auto rounded-xl shadow-xl bg-white border border-gray-200">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                    Voiture
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                    Date Demandée
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-sm uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {interventions.map((intervention, index) => (
                  <tr
                    key={intervention.id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50 transition-colors duration-200 border-b border-gray-200`}
                  >
                    <td className="px-6 py-4 text-gray-700">
                      {intervention.typeintervention || "Non spécifié"}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {intervention.car?.carname || "Voiture inconnue"}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {intervention.user?.fname || "Client inconnu"}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {intervention.datedemand
                        ? new Date(intervention.datedemand).toLocaleDateString()
                        : "Non spécifiée"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          intervention.status === "Demande"
                            ? "bg-yellow-100 text-yellow-800"
                            : intervention.status === "en cours"
                            ? "bg-green-100 text-green-800"
                            : intervention.status === "refusé"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {intervention.status || "Inconnu"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center flex justify-center space-x-3">
                      <button
                        onClick={() =>
                          updateInterventionStatus(intervention.id, "Terminer")
                        }
                        className={`px-4 py-2 rounded-lg flex items-center shadow-md transition-all duration-200 ${
                          intervention.status === "en cours"
                            ? "bg-green-500 text-white hover:bg-green-600 hover:shadow-lg"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={intervention.status !== "en cours"}
                      >
                        <FaCheck className="mr-2" />
                        Terminer
                      </button>
                      {/* <button
                        onClick={() =>
                          updateInterventionStatus(intervention.id, "refusé")
                        }
                        className={`px-4 py-2 rounded-lg flex items-center shadow-md transition-all duration-200 ${
                          intervention.status === "Demande"
                            ? "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={intervention.status !== "Demande"}
                      >
                        <FaTimes className="mr-2" />
                        Décliner
                      </button>
                      */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 italic">
            Aucune intervention disponible.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserListIntervention;
