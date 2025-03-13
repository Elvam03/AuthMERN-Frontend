import { Link } from "react-router-dom";
import AuthContext from "../Context/authContext";
import { useContext } from "react";



const AdminNavbar = () => {
  const { user, handleLogout } = useContext(AuthContext);

  return (
    <nav className="bg-amber-100 flex justify-between items-center gap-2 p-2">

      {/* Navigation Links */}
      <div className="space-x-6">
      <Link to="/admin-dashboard" className="hover:underline">
          Main
        </Link>
        <Link to="/admin-clinics" className="hover:underline">
          Clinics
        </Link>
        <Link to="/admin-resource" className="hover:underline">
          Resources
        </Link>
      </div>

      {/* Logout Button */}
      <button onClick={handleLogout} className="p-2 bg-red-500 text-white">Logout</button>
        
    </nav>
  );
};

export default AdminNavbar;
