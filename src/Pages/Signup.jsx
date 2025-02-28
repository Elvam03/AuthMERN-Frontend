
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Context/authContext";
import { Link } from "react-router-dom";


const SignUp = () => {
    const { handleSignup } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleSignup(formData);
            navigate("/login");
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form className="w-80 space-y-4" onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" onChange={handleChange} className="w-full p-2 border" required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border" required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border" required />
                <button type="submit" className="w-full p-2 bg-blue-500 text-white">Sign Up</button>
                <p className="m-3">Already have an account
                    <Link className="text-blue-500 hover:underline px-2"
                        to="/login">
                        Log in
                    </Link>
                </p>

                
            </form>
        </div>
    );
};

export default SignUp;
