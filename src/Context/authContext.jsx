import { createContext, useState, useEffect } from "react";
import { signup, login, fetchProtectedData } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // ✅ Ensure it's a string

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchProtectedData(token)
        .then((data) => {
          setUser(data);
          setError(""); // ✅ Clear error
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleSignup = async (userData) => {
    try {
        const data = await signup(userData);

        // Check if the API response contains an error message
        if (!data.token) {
            throw new Error(data.message || "Signup failed");
        }

        localStorage.setItem("token", data.token);
        const userDataFetched = await fetchProtectedData(data.token);
        setUser(userDataFetched);
        setError("");
    } catch (error) {
        setError(error.response?.data?.message || "Signup failed"); 
        throw error; // 🔴 Ensure the error is thrown so the UI handles it correctly
    }
};



  // Handle login
  const handleLogin = async (userData) => {
    try {
      const data = await login(userData);
      localStorage.setItem("token", data.token);
      const userDataFetched = await fetchProtectedData(data.token);
      setUser(userDataFetched);
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed"); // ✅ Ensure error is a string
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setError("");
  };

  return (
    <AuthContext.Provider value={{ user, handleSignup, handleLogin, handleLogout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
