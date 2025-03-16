import React from "react";
import UserNavigation from "../../components/user/UserNavigation.jsx";
import UserHeader from "../../components/user/UserHeader.jsx";

function UserHome() {
  return (
    <div>
      <UserNavigation />
      <UserHeader />
      <div className="ml-60 p-10">
        <div>hella!</div>
      </div>
    </div>
  );
}
export default UserHome;
