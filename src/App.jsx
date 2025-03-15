import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import AuthContext from "./Context/authContext";
import { ToastContainer } from "react-toastify";
import ProfilePage from "./Pages/ProfilePage";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import ResourcePage from "./Pages/ResourcePage";
import AdminDashboard from "./Pages/adminDashboard"
import AdminResource from "./Pages/adminResource";
import FacilitySection from "./Pages/FacilitySection";
import FacilityPage from "./Pages/FacilityPage";
import AdminFacility from "./Pages/adminFacility";
import AdminAds from "./Pages/adminAds";


const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.isAdmin || localStorage.getItem("isAdmin") === "true";

  return isAdmin ? children : <Navigate to="/dashboard" />;
};


function App() {
  return (

    <div>
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/facilitySection" element={<FacilitySection />} />
        <Route path="/facilityPage" element={<FacilityPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profilePage" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/resourcePage" element={<ProtectedRoute><ResourcePage /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin-resource" element={<AdminRoute><AdminResource /></AdminRoute>} />
        <Route path="/admin-facility" element={<AdminRoute><AdminFacility /></AdminRoute>} />
        <Route path="/admin-facilityAds" element={<AdminRoute><AdminAds /></AdminRoute>} />



      </Routes>
    </div>


  );
}

export default App;
