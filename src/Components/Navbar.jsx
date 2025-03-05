import React, { useContext } from "react";
import ProfileCard from "./ProfileCard";
// import SearchBar from "./Searchbar";
import AuthContext from "../Context/authContext";
import { Link } from "react-router-dom";

const Navbar = () => {
    const { user, handleLogout } = useContext(AuthContext);

    return (
        <div className="bg-white shadow-md ">
            <div className="py-4 px-6 flex justify-between items-center">
                {/* Logo */}
              <div>
              <Link className="text-blue-500 hover:underline" to= "/dashboard">
                Home
                </Link>
              </div>

              <div>
                <Link className="text-blue-500 hover:underline" to= "/profilePage">
                Profile
                </Link>

                
              </div>

                <div>
                    <ProfileCard onLogout={handleLogout} />


                </div>
            </div>

        </div>
    );
};

export default Navbar;
