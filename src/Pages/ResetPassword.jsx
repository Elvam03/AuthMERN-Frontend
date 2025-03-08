import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate(); // Hook for redirection
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`https://authmern-backend-i3kc.onrender.com/api/auth/reset-password/${token}`, { newPassword });
            setMessage(response.data.message);
            
            // Redirect after a successful password reset
            setTimeout(() => {
                navigate("/login"); // Redirects to login page after 3 seconds
            }, 3000);
        } catch (error) {
            setMessage("Failed to reset password");
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
            <div className="md:w-96 border border-gray-300 rounded-lg bg-white px-7 py-10">
                <h2 className="text-blue-500 text-2xl text-center m-3">Reset Password</h2>
                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
                    <input 
                        type="password" 
                        placeholder="Enter new password" 
                        className="m-2 border border-gray-300 outline-none w-full p-2" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required 
                    />
                    <div className="flex justify-center items-center mt-3">
                        <button type="submit" className="bg-green-500 p-2 text-white cursor-pointer">
                            Reset Password
                        </button>
                    </div>
                </form>
                {message && <p className="text-center mt-3">{message}</p>}
            </div>
        </div>
    );
};

export default ResetPassword;
