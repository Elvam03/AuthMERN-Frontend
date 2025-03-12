import axios from "axios";

const API_URL = "https://authmern-backend-i3kc.onrender.com/api/auth"; // ✅ Use HTTP for local dev

export const signup = async (userData) => {
  try {
    console.log("Signup Request Sent:", userData); // Debugging  
    const response = await axios.post(`${API_URL}/signup`, userData);
    console.log("Signup Response:", response.data); // Debugging  
    return response.data;
  } catch (error) {
    console.error("Signup Error:", error.response || error.message);
    throw new Error(error.response?.data?.message || "Signup failed");
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    const token = response.data.token;
    console.log("Token received:", token); // Debugging  

    if (token) {
      localStorage.setItem("token", token);
    }

    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response || error.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};


export const fetchProtectedData = async () => {
  const token = localStorage.getItem("token");
  // console.log("Fetching protected data with token:", token); // Debugging  

  if (!token) {
    console.error("No token found!");
    throw new Error("Unauthorized");
  }

  try {
    const response = await axios.get(`${API_URL}/protected`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // console.log("Protected Data Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Fetch Protected Data Error:", error.response || error.message);
    throw new Error(error.response?.data?.message || "Unauthorized");
  }
};
