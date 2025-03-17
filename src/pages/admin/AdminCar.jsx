import React, { useState, useEffect } from "react";
import AdminNavigation from "../../components/admin/AdminNavigation.jsx";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import api from "../../services/axios.js";
import { FaCar, FaEye, FaSearch, FaChevronDown } from "react-icons/fa";

const AdminCar = () => {
    const [cars, setCars] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Organisation des marques par catégories
    const brandCategories = [
        {
            title: "Marques Européennes",
            brands: [
                "Audi", "BMW", "Citroën", "Dacia", "Fiat", "Jaguar",
                "Land Rover", "Mercedes-Benz", "Opel", "Peugeot",
                "Porsche", "Renault", "Rolls-Royce", "Seat",
                "Skoda", "Volkswagen", "Volvo"
            ].sort()
        },
        {
            title: "Marques Américaines",
            brands: [
                "Buick", "Cadillac", "Chevrolet", "Chrysler",
                "Dodge", "Ford", "GMC", "Jeep", "Lincoln", "Tesla"
            ].sort()
        },
        {
            title: "Marques Asiatiques",
            brands: [
                "Acura (Honda)", "Daihatsu", "Honda", "Hyundai",
                "Infiniti (Nissan)", "Isuzu", "Kia", "Lexus (Toyota)",
                "Mazda", "Mitsubishi", "Nissan", "Subaru",
                "Suzuki", "Toyota"
            ].sort()
        },
        {
            title: "Marques de Luxe et Sportives",
            brands: [
                "Aston Martin", "Bentley", "Bugatti", "Ferrari",
                "Lamborghini", "Maserati", "McLaren"
            ].sort()
        }
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");
        api.get("cars", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setCars(response.data.data)
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                setIsLoading(false);
            });
    }, []);
    const hasActiveFilters = selectedBrand || search;

    const filteredCars = cars.filter(car => {
        const matchesBrand = !selectedBrand || car.marque === selectedBrand;
        const matchesSearch = search.toLowerCase().split(" ").every(term =>
            car.carname.toLowerCase().includes(term) ||
            car.immatriculation.toLowerCase().includes(term) ||
            car.user.fname.toLowerCase().includes(term)
        );
        return matchesBrand && matchesSearch;
    });
    const handleResetFilters = () => {
        setSelectedBrand("");
        setSearch("");
        setSelectedCar(null);
        setIsBrandDropdownOpen(false);
    };
    return (
        <div className="bg-white min-h-screen">
            <AdminNavigation />
            <AdminHeader />

            <div className="ml-64 mt-6 mr-6 p-8 bg-gray-100">
                <div className="bg-white p-6 rounded-2xl shadow-xl">
                    {/* Filtres */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
                            <FaCar className="mr-2 text-blue-500" />
                            Car list
                        </h1>

                        <div className="flex gap-4 mb-6">
                            {/* Dropdown des marques */}
                            <div className="relative flex-1">
                                <button
                                    onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
                                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition"
                                >
                                    <span>{selectedBrand || "Toutes les marques"}</span>
                                    <FaChevronDown className="text-gray-400" />
                                </button>

                                {isBrandDropdownOpen && (
                                    <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-100 max-h-96 overflow-y-auto">
                                        {brandCategories.map((category, index) => (
                                            <div key={index}>
                                                <div className="px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-600 border-b">
                                                    {category.title}
                                                </div>
                                                {category.brands.map((brand, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => {
                                                            setSelectedBrand(brand);
                                                            setIsBrandDropdownOpen(false);
                                                        }}
                                                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition"
                                                    >
                                                        {brand}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                        <div
                                            onClick={handleResetFilters}
                                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-blue-600 font-medium border-t"
                                        >
                                            Reset
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Champ de recherche */}
                            <div className="relative flex-1">
                                <FaSearch className="absolute top-4 left-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="search car"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                                />
                            </div>
                        </div>
                    </div>

                    {!isLoading && (
                        <div className="mb-8">
                            <div className="grid grid-cols-1 gap-4">
                                {(hasActiveFilters ? filteredCars : []).map((car) => (
                                    <div
                                        key={car.id}
                                        onClick={() => setSelectedCar(car)}
                                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition"
                                    >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-lg">{car.carname}</h3>
                                            <p className="text-gray-600">{car.marque}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">{car.immatriculation}</p>
                                            <p className="text-sm text-gray-500">{car.user.fname} {car.user.lname}</p>
                                        </div>
                                    </div>
                                    </div>
                                ))}
                            </div>

                            {hasActiveFilters && filteredCars.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    Aucun véhicule trouvé
                                </div>
                            )}
                        </div>
                    )}

                    {/* Détails du véhicule sélectionné */}
                    {selectedCar && (
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h2 className="text-xl font-bold mb-4 flex items-center">
                                <FaEye className="mr-2 text-blue-500" />
                                Détails du véhicule
                            </h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="font-semibold">Name or Serie:</p>
                                    <p>{selectedCar.carname}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Mark:</p>
                                    <p>{selectedCar.marque}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Immatriculation:</p>
                                    <p>{selectedCar.immatriculation}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Customer:</p>
                                    <p>{selectedCar.user.fname} {selectedCar.user.lname}</p>
                                </div>
                                <div className="col-span-2">

                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminCar;