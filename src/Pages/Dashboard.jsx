import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../Context/authContext";
import Navbar from "../Components/Navbar";

const Dashboard = () => {
  const { user, handleLogout } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  return (

    <div className="min-h-screen">

      <div className="sticky top-0">
        <Navbar />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user?.firstName || "User"}!</h2>
        <button onClick={handleLogout} className="p-2 bg-red-500 text-white">Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
