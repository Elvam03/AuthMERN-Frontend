import React, { useContext } from "react";
import ProfileCard from "./ProfileCard";
import SearchBar from "./Searchbar";
import AuthContext from "../Context/authContext";

const Navbar = () => {
    const { user, handleLogout } = useContext(AuthContext);

    return (
        <div className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
            {/* Logo */}
            <h1 className="text-lg font-bold text-gray-700 cursor-pointer">
                My Site
            </h1>

            <div>
                <SearchBar/>
            </div>

            <div>
            <ProfileCard onLogout={handleLogout} />


            </div>
        </div>
    );
};

export default Navbar;
