import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaUser, FaArrowLeft } from "react-icons/fa"; // Ajout de FaArrowLeft
import { motion } from "framer-motion";
import api from "../services/axios.js";

const Register = () => {
  // State
  const [step, setStep] = useState(1);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  // Comportement
  const handleNext = (e) => {
    e.preventDefault();
    if (!lname || !address) {
      setErrors("Please fill in all required fields");
      return;
    }
    setErrors("");
    setStep(2);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors("");
    setValidationErrors({});

    if (password !== confirmPassword) {
      setErrors("Passwords do not match");
      return;
    }

    try {
      const response = await api.post("/register", {
        fname,
        lname,
        email,
        password,
        address,
      });

      if (response.status === 201) {
        console.log("Inscription réussie :", response.data);
        navigate("/login");
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setValidationErrors(err.response.data.errors);
      } else {
        setErrors(
          err.response?.data?.message || "Erreur lors de l'inscription"
        );
      }
      console.error("Erreur :", err.response?.data);
    }
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.5 } },
  };

  // Rendu
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-2xl w-96"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          {step === 2 && (
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setStep(1)}
              className="cursor-pointer text-gray-600"
            >
              <FaArrowLeft size={24} />
            </motion.div>
          )}
          <h2
            className={`text-3xl font-semibold text-center text-gray-800 flex-1 ${
              step === 2 ? "ml-1" : ""
            }`}
          >
            Sign up - Step {step} of 2
          </h2>
          {step === 1 && <div className="w-6" />}{" "}
          {/* Placeholder pour équilibrer */}
        </div>
        {errors && <p className="text-red-500 text-center mb-4">{errors}</p>}

        {step === 1 ? (
          <motion.form
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onSubmit={handleNext}
          >
            <div className="relative mb-4">
              <FaUser className="absolute left-3 top-4 text-gray-400" />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
                required
              />
              {validationErrors.lname && (
                <p className="text-red-500 text-sm">
                  {validationErrors.lname[0]}
                </p>
              )}
            </div>
            <div className="relative mb-4">
              <FaUser className="absolute left-3 top-4 text-gray-400" />
              <input
                type="text"
                placeholder="First Name"
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
              />
            </div>
            <div className="relative mb-4">
              <FaUser className="absolute left-3 top-4 text-gray-400" />
              <input
                type="text"
                placeholder="Address"
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              {validationErrors.address && (
                <p className="text-red-500 text-sm">
                  {validationErrors.address[0]}
                </p>
              )}
            </div>
            <motion.button
              type="submit"
              className="w-full bg-blue-500 text-white font-sans text-lg p-2 rounded-[25px] hover:bg-blue-600 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next
            </motion.button>
          </motion.form>
        ) : (
          <motion.form
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onSubmit={handleRegister}
          >
            <div className="relative mb-4">
              <p className="absolute top-3 left-3 text-gray-400">@</p>
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm">
                  {validationErrors.email[0]}
                </p>
              )}
            </div>
            <div className="relative mb-4">
              <FaLock className="absolute left-3 top-4 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {validationErrors.password && (
                <p className="text-red-500 text-sm">
                  {validationErrors.password[0]}
                </p>
              )}
            </div>
            <div className="relative mb-4">
              <FaLock className="absolute left-3 top-4 text-gray-400" />
              <input
                type="password"
                placeholder="Confirm your Password"
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <motion.button
              type="submit"
              className="w-full bg-blue-500 text-white font-sans text-lg p-2 rounded-[25px] hover:bg-blue-600 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Register
            </motion.button>
          </motion.form>
        )}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <span className="text-blue-500 cursor-pointer">
            <a href="/">Sign in</a>
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
