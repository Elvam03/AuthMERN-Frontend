import { createContext, useState, useEffect } from "react";
import { signup, login, fetchProtectedData } from "../api/authApi";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

        if (!data || !data.token) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

            throw new Error(data.message || "Login failed: Invalid credentials");
        }

        localStorage.setItem("token", data.token);

        const userDataFetched = await fetchProtectedData(data.token);

        if (!userDataFetched || !userDataFetched._id) {
            throw new Error("Login failed: User data not found");
        }

        const userObj = {
            firstName: userDataFetched.firstName || "", 
            secondName: userDataFetched.secondName || "",
            email: userDataFetched.email,
            age: userDataFetched.age,
            phone: userDataFetched.phone,
            location: userDataFetched.location,
            userId: userDataFetched._id,
            token: data.token, 
            isAdmin: userDataFetched.isAdmin,
        };

        setUser(userObj);
        localStorage.setItem("user", JSON.stringify(userObj));
        localStorage.setItem("isAdmin", userDataFetched.isAdmin);

        setError("");

        if (userObj.isAdmin) {
          navigate("/admin-dashboard"); // Redirect admin users
      } else {
          navigate("/dashboard"); // Redirect normal users
      }
      
    } catch (error) {
        console.error("Login Error:", error);
        setError(error.message || "Login failed");

        // 🔴 Ensure that an invalid login does NOT keep any token stored
        localStorage.removeItem("token");
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
