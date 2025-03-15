import React, { useContext } from "react";
import { Link } from "react-router-dom";

const LandingNavbar = () => {

    return (
        <div className="bg-white shadow-md ">
            <div className="py-4 px-6 flex justify-between items-center">
                {/* Logo */}
              <div>
              <Link className="text-blue-500 hover:underline" to= "/">
                Login
                </Link>
              </div>

              <div>
                <Link className="text-blue-500 hover:underline" to= "/facilitySection">
                Facilities
                </Link>

                
              </div>

            </div>

        </div>
    );
};

export default LandingNavbar;
