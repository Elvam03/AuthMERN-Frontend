import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../Context/authContext";
import Navbar from "../Components/Navbar";

const ProfilePage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const { user } = useContext(AuthContext);

    const [profileData, setProfileData] = useState({
        name: "",
        age: "",
        email: "",
        phone: "",
        location: "",
        profileImage: "/Images/noprofile.png", // Default profile image
        backgroundImage: "/Images/Background img.jpg" // Default background


    });

    useEffect(() => {
        if (user) {
            const capitalize = (str) =>
                str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

            setProfileData((prevData) => ({
                ...prevData,
                name: `${capitalize(user.firstName)} ${capitalize(user.secondName)}`.trim(),
                email: user.email || "",
            }));
        }
    }, [user]);



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

    // Handle Image Upload
    const handleImageChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileData((prevData) => ({
                ...prevData,
                [type]: imageUrl
            }));
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log("Updated Profile Data:", profileData);
        closeModal();
    };

    return (
        <div>
            <div className="sticky top-0">
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
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e, "backgroundImage")}
                    />
                  </label>
                </div>

                <div className="container mx-auto px-6 -mt-20 relative">
                    <div className="bg-teal-700 text-white p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col items-center">
                            {/* Profile Image */}
                            <div className="w-32 h-32 rounded-full overflow-hidden relative">
                                <img
                                    src={profileData.profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                                {/* Profile Image Upload */}
                                <label className="absolute bottom-0 right-0 bg-white px-2 py-1 rounded-full cursor-pointer text-xs font-medium shadow">
                                    📷
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageChange(e, "profileImage")}
                                    />
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
                    <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Profile</h2>
                        <form onSubmit={handleFormSubmit}>
                            {/* Name (Read-Only) */}
                            <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    className="w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                                    value={profileData.name}
                                    readOnly
                                />
                            </div>

                            {/* Email (Read-Only) */}
                            <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    className="w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                                    value={profileData.email}
                                    readOnly
                                />
                            </div>

                            {/* Message */}
                            <p className="text-xs text-gray-500 mb-4">
                                * Name and email can only be edited in the settings section.
                            </p>

                            {/* Other Editable Fields */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Age</label>
                                <input
                                    name="age"
                                    type="text"
                                    className="w-full p-2 border rounded-lg"
                                    value={profileData.age}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    name="phone"
                                    type="text"
                                    className="w-full p-2 border rounded-lg"
                                    value={profileData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Location</label>
                                <input
                                    name="location"
                                    type="text"
                                    className="w-full p-2 border rounded-lg"
                                    value={profileData.location}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ProfilePage;
