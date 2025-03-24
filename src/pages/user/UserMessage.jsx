import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Echo from "laravel-echo";
import api from "../../services/axios.js";
import AdminNavigation from "../../components/admin/AdminNavigation.jsx";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import { FaUser, FaPaperPlane } from "react-icons/fa";


const UserMessage = () => {
    const [users, setUsers] = useState([]);
    const [currentUser , setCurrentUser ] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get("/admin", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setUsers(response.data);
            } catch (error) {
                console.error("Erreur lors du chargement des utilisateurs", error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const echo = new Echo({
            broadcaster: 'socket.io',
            host: window.location.hostname + ':6001',
            client: io,
            auth: {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}}
        });

        if (currentUser ) {
            echo.private(`user.${currentUser }`)
                .listen('MessageSent', function (e) {
                    console.log(e)
                    //setMessages(prevMessages => [...prevMessages, { user: e.user, message: e.message }]);

                });
        }

        return () => {
            echo.disconnect();
        };
    }, [currentUser ]);

    const selectUser  = async (userId) => {
        setCurrentUser (userId);
        try {
            const response = await api.get(`/messages?recipient_id=${userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setMessages(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des messages", error);
        }
    };

    const sendMessage = async () => {
        if (!currentUser  || !message.trim()) return;

        try {
            await api.post("/messages", { message, recipient_id: currentUser  }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });

            setMessage("");
        } catch (error) {
            console.error("Erreur d'envoi du message :", error.response?.data || error);
        }
    };


    return (
        <div>
            <AdminNavigation />
            <AdminHeader />
            <div className="flex ml-64 mt-6 mr-6 p-8 bg-gray-100">
                {/* Liste des utilisateurs redesign */}
                <div className="w-1/4 p-4 bg-white shadow-xl rounded-2xl mr-4">
                    <h3 className="text-2xl font-bold mb-6 text-gray-700 flex items-center">
                        <FaUser className="mr-2 text-blue-500" />
                        Customers
                    </h3>

                    <ul className="space-y-2">
                        {users.map(({ id, fname,lname, role }) => (
                            <li
                                key={id}
                                onClick={() => selectUser(id)}
                                className={`p-3 rounded-xl cursor-pointer transition-all flex items-center
                                    ${currentUser === id ? 'bg-blue-50 border-2 border-blue-200' : 'hover:bg-gray-50'}`}
                            >
                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                    <FaUser className="text-blue-500 text-lg" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-700">{fname} {lname}</p>
                                    <p className="text-sm text-gray-500 font-medium">{role}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Conversation redesign */}
                <div className="flex-1 p-6 bg-white shadow-xl rounded-2xl">
                    <h2 className="text-2xl font-bold text-gray-700 mb-8">Discussion</h2>
                    {currentUser && (
                        <div className="h-full flex flex-col">
                            <div className="flex-1 bg-gray-50 p-4 rounded-xl shadow-inner mb-6 overflow-y-auto">
                                {messages.map(({ user, message }, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${user.id === currentUser ? 'justify-end' : 'justify-start'} mb-4`}
                                    >
                                        <div className={`max-w-[70%] p-3 rounded-2xl  ${
                                            user.id === currentUser
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-blue-200 border-2 border-gray-100'
                                        }`}>
                                            <p className="font-semibold mb-1">{user?.fname || "inconnu"}</p>
                                            <p className="text-sm">{message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center mb-16">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Écrire un message..."
                                    className="flex-1 p-3 border-2 border-gray-200 rounded-xl mr-3 font-medium focus:border-blue-300"
                                />
                                <button
                                    onClick={sendMessage}
                                    className={`p-3 rounded-xl transition-colors ${
                                        message
                                            ? 'bg-blue-700 hover:bg-blue-800 text-white'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <FaPaperPlane className="text-lg" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserMessage;