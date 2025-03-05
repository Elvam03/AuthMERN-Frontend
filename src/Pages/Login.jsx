import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Context/authContext";
import { Link } from "react-router-dom";
import PasswordInput from "../Inputs/passwordInput";

const Login = () => {
  const { handleLogin, error: authError } = useContext(AuthContext); // ✅ Auth error from context
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({}); // ✅ Stores validation errors

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // ✅ Real-time validation on input change
    if (e.target.name === "email" && !/\S+@\S+\.\S+/.test(e.target.value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Enter a valid email address",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await handleLogin(formData);
      navigate("/dashboard");
    } catch (err) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        general: err.message || "Login failed",
        email: err.message.includes("email") ? err.message : prevErrors.email,
        password: err.message.includes("password") ? err.message : prevErrors.password,
      }));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <div className="md:w-96 border border-gray-300 rounded-lg bg-white px-7 py-10">
        <form className="w-60 md:w-80 space-y-4" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="w-full">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border ${errors.email ? "border-red-500" : "border-gray-300"}`}
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div className="w-full">
            <PasswordInput
              name="password" // ✅ Ensure password input has a name
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Password"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* General Error Message (Login failed, etc.) */}
          {authError && <p className="text-red-500 text-xs mt-1 text-center">{authError}</p>} {/* ✅ Show auth error */}
          {errors.general && <p className="text-red-500 text-xs mt-1 text-center">{errors.general}</p>}

          <button type="submit" className="w-full p-2 bg-blue-500 text-white">
            Login
          </button>

          <p className="m-3">
            Don't have an account?
            <Link className="text-blue-500 hover:underline px-2" to="/signup">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
