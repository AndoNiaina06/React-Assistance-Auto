import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCar, FaUser, FaTag } from "react-icons/fa";
import { motion } from "framer-motion";
import api from "../services/axios";

const AddCar = () => {
  const [user_id, setUserId] = useState("");
  const [carname, setCarName] = useState("");
  const [immatriculation, setImmatriculation] = useState("");
  const [marque, setMarque] = useState("");
  const [errors, setErrors] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const handleAddCar = async (e) => {
    e.preventDefault();
    setErrors("");
    setValidationErrors({});

    try {
      const token = localStorage.getItem("token");
      let currentUserId = user_id; // Valeur initiale de userId

      if (token) {
        try {
          const response = await api.get("/userProfile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          currentUserId = response.data.id; // Utiliser l'ID directement
          setUserId(currentUserId); // Mettre à jour l'état pour l'affichage
          console.log("ID utilisateur récupéré :", currentUserId);
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
      } else {
        setErrors("Vous devez être connecté pour ajouter une voiture.");
        return;
      }

      const response = await api.post(
        "/cars",
        {
          user_id: currentUserId, // Utiliser la variable locale au lieu de userId
          carname,
          immatriculation,
          marque,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Voiture ajoutée :", response.data);
        navigate("/user-dashboard");
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setValidationErrors(err.response.data.Message || {});
        setErrors(
          "Vérifiez les champs saisis : " +
            JSON.stringify(err.response.data.Message)
        );
      } else {
        setErrors(
          err.response?.data?.Message || "Erreur lors de l'ajout de la voiture"
        );
      }
      console.error("Erreur :", err.response?.data);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const inputVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <motion.div
        className="bg-white p-10 rounded-3xl shadow-3xl w-[32rem] border border-gray-200/50 backdrop-blur-md relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-gray-200/10"
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 z-10 relative">
          Add Your Car
        </h2>
        {errors && (
          <motion.p
            className="text-red-500 text-center mb-6 font-medium z-10 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {errors}
          </motion.p>
        )}
        <form onSubmit={handleAddCar} className="space-y-6 z-10 relative">
          <motion.div variants={inputVariants}>
            <div className="relative">
              {validationErrors.user_id && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.user_id[0]}
                </p>
              )}
            </div>
          </motion.div>
          <motion.div variants={inputVariants}>
            <div className="relative">
              <FaCar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Car Name"
                className="w-full pl-12 p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all bg-white/80"
                value={carname}
                onChange={(e) => setCarName(e.target.value)}
                required
              />
              {validationErrors.carname && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.carname[0]}
                </p>
              )}
            </div>
          </motion.div>
          <motion.div variants={inputVariants}>
            <div className="relative">
              <FaTag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Immatriculation"
                className="w-full pl-12 p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all bg-white/80"
                value={immatriculation}
                onChange={(e) => setImmatriculation(e.target.value)}
                required
              />
              {validationErrors.immatriculation && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.immatriculation[0]}
                </p>
              )}
            </div>
          </motion.div>
          <motion.div variants={inputVariants}>
            <div className="relative">
              <FaCar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Marque"
                className="w-full pl-12 p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all bg-white/80"
                value={marque}
                onChange={(e) => setMarque(e.target.value)}
                required
              />
              {validationErrors.marque && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.marque[0]}
                </p>
              )}
            </div>
          </motion.div>
          <motion.button
            type="submit"
            className="w-full bg-blue-500 text-white font-sans text-lg p-4 rounded-xl hover:bg-blue-600 transition-all hover:shadow-xl hover:shadow-blue-500/50"
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Car
          </motion.button>
        </form>
        <p className="text-center text-gray-600 mt-8 font-medium z-10 relative">
          Back to{" "}
          <span className="text-blue-500 cursor-pointer hover:underline">
            <a href="/user-dashboard">Dashboard</a>
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default AddCar;
