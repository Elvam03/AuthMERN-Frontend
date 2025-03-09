import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../Context/authContext";
import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";

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
      <div className="border border-gray-100 p-4 m-4 rounded-lg shadow-md">
        <p>Go to <Link className="text-blue-500 hover:underline" to="/resourcePage">Resource page
        </Link>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
