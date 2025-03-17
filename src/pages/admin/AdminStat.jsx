import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import AdminNavigation from "../../components/admin/AdminNavigation.jsx";
import api from "../../services/axios.js";
import { FaUsers, FaCar, FaWrench, FaShieldAlt } from "react-icons/fa";
import {
    Area, AreaChart,
    Bar,
    CartesianGrid,
    ComposedChart,
    Line,
    Pie,
    PieChart,
    ResponsiveContainer,
    XAxis,
    YAxis
} from "recharts";
import {Legend, Tooltip} from "chart.js";

const AdminStat = () => {
    const [totals, setTotals] = useState({
        totalUsers: 0,
        totalCars: 0,
        totalInterventions: 0,
        totalInsurances: 0,
    });
    const [interventionData, setInterventionData] = useState([]);
    const [insuranceData, setInsuranceData] = useState([]);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await api.get('/total-user', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setTotals(prevTotals => ({
                    ...prevTotals,
                    totalUsers: response.data.users || prevTotals.totalUsers,
                    totalCars: response.data.cars || prevTotals.totalCars,
                    totalInterventions: response.data.interventions || prevTotals.totalInterventions,
                    totalInsurances: response.data.insurances || prevTotals.totalInsurances,
                }));
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        fetchStatistics();
    }, []);
    useEffect(() => {
        const fetchIntervention = async () => {
            try {
                const response = await api.get('/intervention-month', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                })
                console.log(response.data);
                setInterventionData(response.data.map(item => ({
                    name: item.month,
                    amt: item.total,
                    pv: item.total,
                    uv: item.total,
                })));
            }catch(error) {
                console.error('Error fetching intervention by month:', error);
            }

        }
        fetchIntervention()
    }, []);
    useEffect(() => {
        const fetchInsurance = async () => {
            try {
                const response = await api.get('/insurance-month', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                })
                console.log(response.data);
                setInsuranceData(response.data.map(item => ({
                    name: item.month,
                    amt: item.total,
                    pv: item.total,
                    uv: item.total,
                })));
            }catch(error) {
                console.error('Error fetching intervention by month:', error);
            }

        }
        fetchInsurance();
    }, []);
    const pieData = [
        { name: 'Users', value: totals.totalUsers, color: '#3B82F6' },
        { name: 'Cars', value: totals.totalCars, color: '#10B981' },
        { name: 'Interventions', value: totals.totalInterventions, color: '#F59E0B' },
        { name: 'Insurances', value: totals.totalInsurances, color: '#EF4444' }
    ];

    return (
        <div>
            <AdminNavigation />
            <AdminHeader />
            <div className="ml-64 mt-6 mr-6 p-8 bg-gray-50 min-h-screen">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b-2 border-blue-100 pb-4">
                    Statistics
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Users Card */}
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:border-blue-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <FaUsers className="text-3xl text-blue-500" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">This year</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Users</h3>
                        <div className="flex items-end justify-between">
                            <p className="text-3xl font-bold text-gray-800">{totals.totalUsers}</p>
                            <span className="text-green-500 bg-green-50 px-2 py-1 rounded-full text-sm">+12%</span>
                        </div>
                    </div>

                    {/* Cars Card */}
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:border-green-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-green-50 p-3 rounded-lg">
                                <FaCar className="text-3xl text-green-500" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Active</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Registered Cars</h3>
                        <div className="flex items-end justify-between">
                            <p className="text-3xl font-bold text-gray-800">{totals.totalCars}</p>
                            <span className="text-blue-500 bg-blue-50 px-2 py-1 rounded-full text-sm">+5%</span>
                        </div>
                    </div>

                    {/* Interventions Card */}
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:border-yellow-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-yellow-50 p-3 rounded-lg">
                                <FaWrench className="text-3xl text-yellow-500" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">This Month</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Interventions</h3>
                        <div className="flex items-end justify-between">
                            <p className="text-3xl font-bold text-gray-800">{totals.totalInterventions}</p>
                            <span className="text-red-500 bg-red-50 px-2 py-1 rounded-full text-sm">-2%</span>
                        </div>
                    </div>

                    {/* Insurances Card */}
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:border-red-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-red-50 p-3 rounded-lg">
                                <FaShieldAlt className="text-3xl text-red-500" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Active</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Insurances</h3>
                        <div className="flex items-end justify-between">
                            <p className="text-3xl font-bold text-gray-800">{totals.totalInsurances}</p>
                            <span className="text-purple-500 bg-purple-50 px-2 py-1 rounded-full text-sm">+8%</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Repartition of Data</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart width={400} height={400}>
                                    <Pie
                                        dataKey="value"
                                        startAngle={180}
                                        endAngle={0}
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        label
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg pb-16">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Intervention by month</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height={400}>
                                <ComposedChart
                                    data={interventionData}
                                    margin={{ top: 20, right: 80, bottom: 20, left: 20 }}
                                >
                                    <CartesianGrid stroke="#f5f5f5" />
                                    <XAxis dataKey="name" label={{ value: 'Mois', position: 'insideBottomRight', offset: 0 }} />
                                    <YAxis label={{ value: 'Nombre d\'interventions', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
                                    <Bar dataKey="pv" barSize={20} fill="#413ea0" />
                                    <Line type="monotone" dataKey="uv" stroke="#ff7300" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Additional Visual Elements */}
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
                    <h3 className="text-xl font-semibold mb-2">Performance Summary</h3>
                    <p className="opacity-90">Total operations processed this month</p>
                    <div className="flex items-center mt-4">
                        <span className="text-4xl font-bold mr-4">1,234</span>
                        <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">+15% from last month</span>
                    </div>
                </div>
                <div className="mt-8 grid grid-cols-1 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Insurance By Month</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height={200}>
                                    <AreaChart
                                        width={500}
                                        height={200}
                                        data={insuranceData}
                                        syncId="anyId"
                                        margin={{
                                            top: 10,
                                            right: 30,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="pv" stroke="#82ca9d" fill="#82ca9d" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminStat;