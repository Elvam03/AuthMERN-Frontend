import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await axios.post(
                "https://authmern-backend-i3kc.onrender.com/api/auth/reset-password",
                { token, newPassword }, // ✅ Send token in body, not URL
                { headers: { "Content-Type": "application/json" } }
            );

            setMessage(response.data.message);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to reset password");
        }
    };

    return (
        <div className="bg-gray-100 flex flex-col justify-center items-center min-h-screen">
            <div className="md:w-96 border border-gray-300 rounded-lg bg-white px-7 py-10">
                <h2 className="text-blue-500 text-2xl text-center m-3">Reset Password</h2>
                <form onSubmit={handleSubmit} className="flex justify-center items-center flex-col">
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
                {message && <p className="text-green-600 mt-3">{message}</p>}
                {error && <p className="text-red-600 mt-3">{error}</p>}
            </div>
        </div>
    );
};

export default ResetPassword;
