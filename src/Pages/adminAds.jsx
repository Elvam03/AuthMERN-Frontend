import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import AdminNavbar from "../Components/adminNavbar";
import AuthContext from "../Context/authContext";
import { useNavigate } from "react-router-dom";

const AdminAds = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [ads, setAds] = useState([]);
    const [editingAd, setEditingAd] = useState(null);
    const { register, handleSubmit, reset, setValue } = useForm();
    const [imagePreview, setImagePreview] = useState(null);

    // Fetch Ads
    const fetchAds = async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.get("https://authmern-backend-i3kc.onrender.com/api/advertisements", { headers });
            setAds(response.data);
        } catch (error) {
            console.error("Error fetching ads:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        if (!user?.isAdmin) navigate("/");
        fetchAds();
    }, []);

    // Handle Image Preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Submit Form (Add or Update)
    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("link", data.link);
            formData.append("description", data.description);
            if (data.image[0]) {
                formData.append("image", data.image[0]);
            }
    
            const token = localStorage.getItem("token");
    
            if (!token) {
                console.error("No authentication token found.");
                return;
            }
    
            const headers = {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            };
    
            if (editingAd) {
                // Update Ad
                await axios.put(`https://authmern-backend-i3kc.onrender.com/api/upload/ads/${editingAd._id}`, formData, { headers });
            } else {
                // Create New Ad
                await axios.post("https://authmern-backend-i3kc.onrender.com/api/upload/ads", formData, { headers });
            }
    
            reset();
            setEditingAd(null);
            setImagePreview(null);
            fetchAds();
        } catch (error) {
            console.error("Error submitting ad:", error.response?.data || error.message);
        }
    };
    

    // Handle Edit Click
    const handleEdit = (ad) => {
        setEditingAd(ad);
        setValue("title", ad.title);
        setValue("link", ad.link);
        setValue("description", ad.description);
        setImagePreview(ad.image);
    };

    // Delete Ad
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No authentication token found.");
                return;
            }

            await axios.delete(`https://authmern-backend-i3kc.onrender.com/api/upload/ads/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            fetchAds();
        } catch (error) {
            console.error("Error deleting ad:", error.response?.data || error.message);
        }
    };

    // Reset Form
    const resetForm = () => {
        reset();
        setImagePreview(null);
        setEditingAd(null);
    };

    return (
        <div>
            <div className="sticky top-0 z-10">
                <AdminNavbar />
            </div>
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold text-center text-blue-900">Admin Ads Dashboard</h1>

                {/* Form Section */}
                <div className="bg-white p-6 rounded-lg shadow-md my-6 max-w-lg mx-auto">
                    <h2 className="text-xl font-semibold text-gray-700">
                        {editingAd ? "Edit Advertisement" : "Add New Advertisement"}
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <input
                            {...register("title")}
                            placeholder="Ad Title"
                            className="w-full p-2 border rounded"
                            required
                        />
                        <input
                            {...register("link")}
                            placeholder="Website Link"
                            className="w-full p-2 border rounded"
                            required
                        />
                        <textarea
                            {...register("description")}
                            placeholder="Description"
                            className="w-full p-2 border rounded"
                            required
                        ></textarea>

                        <input
                            type="file"
                            className="w-full"
                            {...register("image")}
                            onChange={handleImageChange}
                        />

                        {/* Image Preview */}
                        {imagePreview && (
                            <img src={imagePreview} alt="Preview" className="mt-3 rounded-md w-full h-32 object-cover" />
                        )}

                        <div className="flex justify-between">
                            {editingAd && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="bg-gray-500 text-white px-3 py-1 rounded-md"
                                >
                                    Cancel Edit
                                </button>
                            )}
                            <button type="submit" className="bg-blue-600 text-white p-2 rounded-md">
                                {editingAd ? "Update Ad" : "Add Ad"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Ads List */}
                <h2 className="text-xl font-semibold text-gray-700 text-center mt-6">All Advertisements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {ads.map((ad) => (
                        <div key={ad._id} className="bg-white shadow-md rounded-lg p-4">
                            <img src={ad.image} alt={ad.title} className="w-full h-40 object-cover rounded-md mb-2" />
                            <h3 className="text-lg font-semibold">{ad.title}</h3>
                            <p className="text-gray-600">{ad.description}</p>
                            <a href={ad.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                                Visit Website
                            </a>

                            <div className="flex justify-between mt-3">
                                <button
                                    onClick={() => handleEdit(ad)}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded-md"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(ad._id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded-md"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminAds;
