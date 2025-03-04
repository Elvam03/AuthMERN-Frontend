import axios from "axios";

const API_URL = "https://authmern-backend-i3kc.onrender.com/api/auth"; // ✅ Use HTTP for local dev

// Signup function
export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    console.error("Signup Error:", error.response || error.message);
    throw new Error(error.response?.data?.message || "Signup failed");
  }
};

// Login function
export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    console.log("Login API Response:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response || error.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

// Fetch protected data
export const fetchProtectedData = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/protected`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Fetch Protected Data Error:", error.response || error.message);
    throw new Error(error.response?.data?.message || "Unauthorized");
  }
};
