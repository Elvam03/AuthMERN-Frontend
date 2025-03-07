import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../Context/authContext";
import Navbar from "../Components/Navbar";
import axios from "axios";

const ProfilePage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const [selectedFile, setSelectedFile] = useState(null);
    const [userId, setUserId] = useState(null)

    const [profileData, setProfileData] = useState({
        name: "",
        age: "",
        email: "",
        phone: "",
        location: "",
        profileImage: "/Images/noprofile.png", // Default profile image
        backgroundImage: "/Images/background.jpg" // Default background
    });


    if (!user) return <Navigate to="/login" />;

    const openModal = () => {
        setModalOpen(true);
        document.body.classList.add("modal-open");
    };

    const closeModal = () => {
        setModalOpen(false);
        document.body.classList.remove("modal-open");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (user) {
            setUserId(user.userId);

            console.log("Fetching profile data for user:", user.userId);

            axios.get(`https://authmern-backend-i3kc.onrender.com/api/profile/${user.userId}`)
                .then(response => {
                    const userData = response.data;

                    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

                    setProfileData({
                        name: `${capitalize(userData.firstName)} ${capitalize(userData.secondName)}`.trim(),
                        email: userData.email || "",
                        profileImage: userData.profileImage || "/Images/noprofile.png",
                        backgroundImage: userData.backgroundImage || "/Images/background.jpg",
                        age: userData.age || "",
                        phone: userData.phone || "",
                        location: userData.location || ""
                    });
                })
                .catch(error => {
                    console.error("Error fetching profile data:", error.response?.data || error.message);
                });
        }
    }, [user]);

    const handleImageChange = (event, imageType) => {
        const file = event.target.files[0];
        if (!file) {
            console.error("No file selected!");
            return;
        }

        handleImageUpload(file, imageType);
    };

    const handleImageUpload = async (file, imageType) => {
        if (!file || !userId) {
            console.error("File or User ID missing!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "my_preset_name"); // Replace with Cloudinary preset

        try {
            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/dwawmlk54/image/upload",
                formData
            );

            const imageUrl = response.data.secure_url; // Cloudinary returns this URL

            await axios.put(`https://authmern-backend-i3kc.onrender.com/api/profile/${user.userId}`, {
                [imageType]: imageUrl
            });

            setProfileData((prevData) => ({
                ...prevData,
                [imageType]: imageUrl
            }));

            console.log(`Updated ${imageType} successfully!`);

        } catch (error) {
            console.error("Upload failed:", error.response?.data || error.message);
        }
    };
    
    // Inside your JSX
    <input type="file" onChange={handleImageChange} />

    const handleFormSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.put(`https://authmern-backend-i3kc.onrender.com/api/profile/${user.userId}`, {
               name: profileData.name,
                email: profileData.email,
                age: profileData.age,
                phone: profileData.phone,
                location: profileData.location
            });
    
            console.log("Update response:", response.data);

            setProfileData((prevData) => ({
                ...prevData,  // Keep existing fields
                ...response.data.user // Only update changed fields
            }));

            setProfileData(response.data.user);
            closeModal();
        } catch (error) {
            console.error("Update failed:", error.response?.data || error.message);
        }
    };
    
    

    return (
        <div>
            <div className="sticky top-0 z-10">
                <Navbar />
            </div>

            {/* Profile Section */}
            <div className="bg-gray-100">
                {/* Background Image */}
                <div
                    className="relative bg-cover bg-center h-64"
                    style={{
                        backgroundImage: `url(${profileData.backgroundImage})`,
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-60"></div>
                    {/* Background Image Upload */}
                    <label className="absolute top-4 right-4 bg-white px-3 py-1 rounded-lg cursor-pointer text-sm font-medium shadow">
                        Change Background
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, "backgroundImage")} />

                    </label>
                </div>

                <div className="container mx-auto px-6 -mt-20 relative">
                    <div className="bg-teal-700 text-white p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col items-center">
                            {/* Profile Image */}
                            <div className="w-40 h-40 rounded-full overflow-hidden relative">
                                <img
                                    src={profileData.profileImage}
                                    alt="Profile"
                                    className="w-40 h-40 md:w-60 md:w-60 rounded-full object-cover"
                                />

                                {/* Profile Image Upload */}
                                <label className="absolute bottom-0 right-0 bg-white px-2 py-1 rounded-full cursor-pointer text-xs font-medium shadow">
                                    📷
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, "profileImage")} />

                                </label>
                            </div>
                            <h2 className="mt-4 text-2xl font-semibold">
                                {profileData.name || "Your Name"}
                            </h2>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-4">Profile Details</h3>
                            <div className="space-y-2">
                                <p><strong>Name:</strong> {profileData.name}</p>
                                <p><strong>Email:</strong> {profileData.email}</p>
                                <p><strong>Age:</strong> {profileData.age}</p>
                                <p><strong>Phone:</strong> {profileData.phone}</p>
                                <p><strong>Location:</strong> {profileData.location}</p>
                            </div>

                            <button
                                className="mt-6 px-6 py-2 bg-blue-900 text-white rounded-full hover:bg-blue-700 transition duration-300"
                                onClick={openModal}
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm z-50">
                    <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Profile</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input name="name" type="text" className="w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed" value={profileData.name} readOnly />
                            </div>

                            <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input name="email" type="email" className="w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed" value={profileData.email} readOnly />
                            </div>

                            <p className="text-xs text-gray-500 mb-4">* Name and email can only be edited in the settings section.</p>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Age</label>
                                <input name="age" type="text" className="w-full p-2 border rounded-lg" value={profileData.age} onChange={handleInputChange} />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input name="phone" type="text" className="w-full p-2 border rounded-lg" value={profileData.phone} onChange={handleInputChange} />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Location</label>
                                <input name="location" type="text" className="w-full p-2 border rounded-lg" value={profileData.location} onChange={handleInputChange} />
                            </div>

                            <div className="flex justify-end gap-2">
                                <button type="button" className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
