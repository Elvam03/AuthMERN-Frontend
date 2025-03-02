import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Context/authContext";
import { Link } from "react-router-dom";
import PasswordInput from "../Inputs/passwordInput"; // ✅ Import PasswordInput

const SignUp = () => {
    const { handleSignup } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        secondName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [error, setError] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName) newErrors.firstName = "First name is required";
        if (!formData.secondName) newErrors.secondName = "Second name is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Enter a valid email address";
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        if (e.target.name === "email" && !/\S+@\S+\.\S+/.test(e.target.value)) {
            setErrors((prevErrors) => ({ ...prevErrors, email: "Enter a valid email address" }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
    
        try {
            await handleSignup(formData);
            setShowSuccessModal(true);
            setError(""); // ✅ Clear errors on success
        } catch (err) {
            setError(err.message); // ✅ Display exact error from backend
            setShowSuccessModal(false);
        }
    };
    
    

    // console.log("Form Data Before Sending:", formData);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50">
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <div className="w-96 border border-gray-300 rounded-lg bg-white px-7 py-10">
                <form className="w-80 space-y-4" onSubmit={handleSubmit}>
                    <div className="w-full">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`w-full p-2 border ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
                            required
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>

                    <div className="w-full">
                        <input
                            type="text"
                            name="secondName"
                            placeholder="Second Name"
                            value={formData.secondName}
                            onChange={handleChange}
                            className={`w-full p-2 border ${errors.secondName ? "border-red-500" : "border-gray-300"}`}
                            required
                        />
                        {errors.secondName && <p className="text-red-500 text-xs mt-1">{errors.secondName}</p>}
                    </div>

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

                    <div className="w-full">
                        <PasswordInput
                            name="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Password"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    <div className="w-full">
                        <PasswordInput
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            placeholder="Confirm Password"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <button type="submit" className="w-full p-2 bg-blue-500 text-white">Sign Up</button>

                    <p className="m-3">
                        Already have an account?
                        <Link className="text-blue-500 hover:underline px-2" to="/login">
                            Log in
                        </Link>
                    </p>
                    

                </form>
            </div>

            {/* ✅ Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <h3 className="text-xl font-semibold mb-3">Account Created Successfully 🎉</h3>
                        <p className="text-gray-600">You can now log in to your account.</p>
                        <button
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => navigate("/login")}
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignUp;
