import React from "react";
import AdminNavigation from "../../components/admin/AdminNavigation.jsx";
import AdminHeader  from "../../components/admin/AdminHeader.jsx";

function AdminHome() {
    return <div>
        <AdminNavigation />
        <AdminHeader />
        <div className="ml-60 p-10">
            <div>
                hello!
            </div>
        </div>
    </div>
};
export default AdminHome;