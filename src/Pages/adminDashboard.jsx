import AuthContext from "../Context/authContext";
import AdminNavbar from "../Components/adminNavbar";
import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  
  const navigate = useNavigate();


  useEffect(() => {
    if (!user?.isAdmin) navigate("/");
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="sticky top-0 z-10"> 
      <AdminNavbar />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Welcome</h2>

        <div>
          <p>Visit the <Link className = "text-blue-500 hover:underline" to = "/admin-facilityAds">Facility Ads</Link></p>
        </div>
      </div>
     
    </div>
  );
};

export default AdminDashboard;
