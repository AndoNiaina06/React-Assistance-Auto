import {useState} from "react";
import api from "../services/axios.js";
import {FaLock, FaUser} from "react-icons/fa";
//import useNavigate from "react-router-dom";

const Register = () => {
    //State
   const [fname, setFname] = useState('');
   const [lname, setLname] = useState('');
   const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
   const [address, setAddress] = useState('');
   const [errors, setErrors] = useState("");
   //const navigate = useNavigate();

   //comportement

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/register", {
                fname: fname,
                lname: lname,
                email: email,
                password: password,
                address: address,
            })
            console.log(response);
        }catch(err) {
            setErrors(err.message);
        }
    }

    //render
    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Sign up</h2>
                <form onSubmit={handleRegister}>
                    <div className="relative mb-4">
                        <FaUser className="absolute left-3 top-4 text-gray-400" />
                        <input type="text" placeholder="Last Name" className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                               onChange={(e) => setLname(e.target.value)} required />
                    </div>
                    <div className="relative mb-4">
                        <FaUser className="absolute left-3 top-4 text-gray-400" />
                        <input type="text" placeholder="First Name" className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                               onChange={(e) => setFname(e.target.value)} required />
                    </div>
                    <div className="relative mb-4">
                        <FaUser className="absolute left-3 top-4 text-gray-400" />
                        <input type="text" placeholder="Address" className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                               onChange={(e) => setAddress(e.target.value)} required />
                    </div>
                    <div className="relative mb-4">
                        <p className=" absolute top-3 left-3 text-gray-400">@</p>
                        <input type="email" placeholder="Email" className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                           onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="relative mb-4">
                        <FaLock className="absolute left-3 top-4 text-gray-400" />
                        <input type="password" placeholder="Password" className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                               onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="relative mb-4">
                        <FaLock className="absolute left-3 top-4 text-gray-400" />
                        <input type="password" placeholder="Confirm your Password" className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                           onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white font-sans text-lg p-2 rounded-[25px] hover:bg-blue-600 transition">
                        Register
                    </button>
                </form>
                <p className="text-center text-gray-600 mt-4">
                    Already have account?
                    <span className="text-blue-500 cursor-pointer ml-2">
                       <a href="/">Sign in</a>
                    </span>
                </p>

            </div>
        </div>
    );

};
export default Register;