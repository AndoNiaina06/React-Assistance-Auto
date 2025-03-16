// end point users-with-cars

import React, {useEffect, useState} from "react";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import AdminNavigation from "../../components/admin/AdminNavigation.jsx";
import api from "../../services/axios.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";

const AdminCustomer = () => {
    //state
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");

    //comportement
    useEffect(() => {
        const token = localStorage.getItem("token");

        api.get("users-with-cars", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                setCustomers(response.data.data);
                //console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    //render
    return (
        <div>
            <AdminNavigation/>
            <AdminHeader/>

            <div className="ml-64 mt-6 mr-6 p-8 bg-gray-200 shadow-lg rounded-xl">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Customer list</h3>
                <input
                    type="text"
                    placeholder="Research"
                    className="mb-4 px-4 py-2 w-1/4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {customers.length > 0 ? (
                    <table className="min-w-full bg-white border rounded-lg overflow-hidden shadow-md">
                        <thead className="bg-blue-700 text-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-white text-left">First Name</th>
                            <th className="px-6 py-3 text-white text-left">Last Name</th>
                            <th className="px-6 py-3 text-white text-left">e-mail</th>
                            <th className="px-6 py-3 text-white text-left">address</th>
                            <th className="px-6 py-3 text-white text-left">total car</th>
                            <th className="px-6 py-0 text-white text-center"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {customers.map((customer, index) =>  (
                            <tr key={index} className="border-b hover:bg-gray-100 transition">
                                <td className="px-6 py-2">{customer.fname}</td>
                                <td className="px-6 py-2">{customer.lname}</td>
                                <td className="px-6 py-2">{customer.email}</td>
                                <td className="px-6 py-2">{customer.address}</td>
                                <td className="px-6 py-2">{customer.cars_count}</td>
                                <td className="px-6 py-2 flex justify-center space-x-3">
                                    <button className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition">
                                        <FontAwesomeIcon icon={faEye} size="sm" style={{color: "#ffffff",}} /> view
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-700 text-center py-6">loading...</p>
                )}
            </div>


        </div>
    );
}


export default AdminCustomer;