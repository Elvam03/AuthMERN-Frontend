import AuthContext from "../Context/authContext";
import AdminNavbar from "../Components/adminNavbar";
import { useContext } from "react";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);



  return (
    <div className="min-h-screen bg-gray-100">

      <div className="sticky top-0 z-10"> 
      <AdminNavbar />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Welcome</h2>
      </div>
     
    </div>
  );
};

export default AdminDashboard;
