import React from "react";
import AdminNavigation from "../../components/admin/AdminNavigation.jsx";
import AdminHeader  from "../../components/admin/AdminHeader.jsx";
import MapDash from "../../components/MapDash.jsx"

function AdminHome() {
    return <div>
        <AdminNavigation />
        <AdminHeader />
        <div className="ml-60 p-10">
            <div className="rounded-3xl shadow-2xl h-full">
                <MapDash />
            </div>
        </div>
    </div>
};
export default AdminHome;