import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Context/authContext";
import { Link } from "react-router-dom";

const Login = () => {
  const { handleLogin, error } = useContext(AuthContext); // ✅ Destructure correctly
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState(""); // ✅ Separate local error state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(formData);
      navigate("/dashboard");
    } catch (err) {
      setLocalError(err.message || "Login failed"); // ✅ Ensure error is a string
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      {/* ✅ Display error messages from context or local error state */}
      {(error || localError) && <p className="text-red-500">{error || localError}</p>} 

      <form className="w-80 space-y-4" onSubmit={handleSubmit}>
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          onChange={handleChange} 
          className="w-full p-2 border" 
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          onChange={handleChange} 
          className="w-full p-2 border" 
          required 
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white">Login</button>

        <p className="m-3">
          Don't have an account? 
          <Link className="text-blue-500 hover:underline px-2" to="/signup">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
