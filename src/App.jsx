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


const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (

    <div>
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profilePage" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/resourcePage" element={<ProtectedRoute><ResourcePage /></ProtectedRoute>} />

        

      </Routes>
    </div>


  );
}

export default App;
