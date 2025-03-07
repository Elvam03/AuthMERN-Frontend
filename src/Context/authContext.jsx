import { createContext, useState, useEffect } from "react";
import { signup, login, fetchProtectedData } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchProtectedData(token)
        .then((data) => {
          setUser(data);
          setError("");
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

  const handleSignup = async (formData) => {
    try {
      const response = await fetch("https://authmern-backend-i3kc.onrender.com/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  
  const handleLogin = async (userData) => {
    try {
      const data = await login(userData);
  
      if (!data.token) {
        throw new Error("Login failed: token not received");
      }
  
      localStorage.setItem("token", data.token);
  
      const userDataFetched = await fetchProtectedData(data.token);
  
      console.log("User data after login:", userDataFetched); // Check backend response structure
  
      setUser({
        firstName: userDataFetched.firstName || "", 
        secondName: userDataFetched.secondName || "",
        email: userDataFetched.email,
        userId: userDataFetched._id,
        token: data.token,  // ✅ Store token in state for API requests
      });
  
      setError("");
    } catch (error) {
      console.error("Login Error:", error);
      setError(error.message || "Login failed");
    }
  };
  

  
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setError("");
  };

  return (
    <AuthContext.Provider
      value={{ user, handleSignup, handleLogin, handleLogout, loading, error, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
