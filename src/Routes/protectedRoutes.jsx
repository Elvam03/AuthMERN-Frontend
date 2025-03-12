import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../Context/authContext";

const ProtectedRoute = ({ children, adminOnly }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/" />; // ✅ Redirect non-admins

  return children;
};

export default ProtectedRoute;
