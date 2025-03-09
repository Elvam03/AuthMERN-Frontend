import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigate hook
import axios from "axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // Hook for navigation

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://authmern-backend-i3kc.onrender.com/api/auth/forgot-password", { email });
            setMessage(response.data.message);

            // Auto-redirect after 5 seconds
            setTimeout(() => {
                navigate("/login");
            }, 5000);
        } catch (error) {
            setMessage("Error sending reset email");
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
            <div className="md:w-96 border border-gray-300 rounded-lg bg-white px-7 py-10">
                <h2 className="text-blue-500 text-2xl text-center m-3">Forgot Password</h2>

                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="m-2 border border-gray-300 outline-none w-full p-2" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <div className="flex justify-center items-center mt-3">
                        <button type="submit" className="bg-green-500 p-2 text-white cursor-pointer">
                            Send Reset Link
                        </button>
                    </div>
                </form>

                {message && <p className="text-center mt-3">{message}</p>}

                {/* Manual link to go back to login */}
                <p className="text-center mt-3">
                    <a href="/login" className="text-blue-500 underline">
                        Go back to Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
