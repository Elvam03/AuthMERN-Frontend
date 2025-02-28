import axios from "axios";

const API_URL = "https://authmern-backend-i3kc.onrender.com/api/auth"; // ✅ Add '/api/auth'

// Signup function
export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData); // ✅ Fix path
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Signup failed";
  }
};

// Login function
export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData); // ✅ Fix path
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed";
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
    throw error.response?.data?.message || "Unauthorized";
  }
};
