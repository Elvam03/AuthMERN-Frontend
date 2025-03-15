import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../Context/authContext";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../Components/adminNavbar";

const AdminFacility = () => {
    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    const [facilities, setFacilities] = useState([]);
    const [newFacility, setNewFacility] = useState({ title: "", location: "", description: "" });
    const [editingFacility, setEditingFacility] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!user?.isAdmin) navigate("/");

        fetchFacilities();
    }, []);

    const fetchFacilities = async () => {
        try {
            const response = await axios.get("https://authmern-backend-i3kc.onrender.com/api/facilities");
            setFacilities(response.data);
        } catch (error) {
            console.error("Error fetching facilities:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setNewFacility({ ...newFacility, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const token = localStorage.getItem("token");
    
            if (!token) {
                console.error("No authentication token found.");
                return;
            }
    
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };

            if (editingFacility) {
                // Edit existing facility
                await axios.put(`https://authmern-backend-i3kc.onrender.com/api/upload/facilities/${editingFacility._id}`, newFacility, { headers });
            } else {
                // Add new facility
                await axios.post("https://authmern-backend-i3kc.onrender.com/api/upload/facilities", newFacility, { headers });
            }
            fetchFacilities(); // Refresh list
            setNewFacility({ title: "", location: "", description: "" });
            setEditingFacility(null);
        } catch (error) {
            console.error("Error saving facility:", error);
        }
    };

    const handleEdit = (facility) => {
        setNewFacility(facility);
        setEditingFacility(facility);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this facility?")) {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("No authentication token found.");
                    return;
                }
                await axios.delete(`https://authmern-backend-i3kc.onrender.com/api/facilities/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchFacilities();
            } catch (error) {
                console.error("Error deleting facility:", error);
            }
        }
    };

    return (
        <div>
            <div>
                <AdminNavbar />
            </div>
            <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-4">Admin Facility Management</h1>

            {/* Facility Form */}
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md mb-4">
                <h2 className="text-lg font-semibold mb-2">{editingFacility ? "Edit Facility" : "Add New Facility"}</h2>
                <input
                    type="text"
                    name="title"
                    placeholder="Facility Title"
                    value={newFacility.title}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-2"
                    required
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={newFacility.location}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-2"
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={newFacility.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-2"
                    required
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    {editingFacility ? "Update Facility" : "Add Facility"}
                </button>
            </form>

            {/* Facilities List */}
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <table className="w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Title</th>
                            <th className="border p-2">Location</th>
                            <th className="border p-2">Description</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facilities.map((facility) => (
                            <tr key={facility._id} className="border">
                                <td className="border p-2">{facility.title}</td>
                                <td className="border p-2">{facility.description}</td>
                                <td className="border p-2">{facility.location}</td>
                                <td className="border p-2">
                                    <button onClick={() => handleEdit(facility)} className="bg-yellow-500 text-white px-3 py-1 rounded m-2">Edit</button>
                                    <button onClick={() => handleDelete(facility._id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
        </div>
    );
};

export default AdminFacility;
