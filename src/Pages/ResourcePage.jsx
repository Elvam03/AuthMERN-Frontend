import React, { useState, useEffect, useContext } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { Navigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import AuthContext from '../Context/authContext';

const ResourcePage = () => {

    const { user } = useContext(AuthContext);
    if (!user) return <Navigate to="/login" />;


    const [activeTab, setActiveTab] = useState('news');
    const [expandedCard, setExpandedCard] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [menuOpen, setMenuOpen] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [newsAndBlog, setNewsAndBlog] = useState([]);
    const [articles, setArticles] = useState([]);
    const [resources, setResources] = useState([]);



    const handleFilter = (filter) => {
        setActiveFilter(filter);
    };

    const filteredContent = (data) => {
        if (activeFilter === 'favorites') {
            return data.filter((item) => favorites.includes(item._id));
        }
        if (activeFilter === 'latest' && activeTab === 'news') {
            return data.filter((item) => new Date(item.createdAt) > Date.now() - 7 * 24 * 60 * 60 * 1000);
        }
        return data;
    };

    const handleMenuToggle = (id) => {
        setMenuOpen(prev => (prev === id ? null : id)); // Toggle only the clicked item
    };


    useEffect(() => {
        const fetchResourcesAndFavorites = async () => {
            try {
                // ✅ Fetch resources (NO TOKEN REQUIRED)
                const resResources = await fetch('https://authmern-backend-i3kc.onrender.com/api/resources');
                const dataResources = await resResources.json();
    
                if (Array.isArray(dataResources)) {
                    setNewsAndBlog(dataResources.filter(item => item.type === 'news'));
                    setArticles(dataResources.filter(item => item.type === 'article'));
                }
    
                // ✅ Fetch user's favorite resources only if logged in
                if (user) {
                    const resFavorites = await fetch(`https://authmern-backend-i3kc.onrender.com/api/resources/favorites`, {
                        headers: { Authorization: `Bearer ${user.token}` },
                    });
    
                    const dataFavorites = await resFavorites.json();
                    console.log("Fetched Favorites:", dataFavorites.favorites); // Debugging
    
                    if (resFavorites.ok) {
                        setFavorites(dataFavorites.favorites.map(fav => fav._id)); // Store correct favorite IDs
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchResourcesAndFavorites();
    }, [user]); // Runs whenever the user logs in or changes
    
    
    
    const handleToggleFavorite = async (id) => {
        console.log("Toggling favorite for ID:", id); // Debugging
    
        if (!id) {
            console.error("Invalid ID received:", id);
            return;
        }
    
        try {
            const isRemoving = favorites.includes(id); // Check if it's a removal operation
    
            const res = await fetch(`https://authmern-backend-i3kc.onrender.com/api/resources/favorites/${id}`, {
                method: isRemoving ? "DELETE" : "POST", // Use DELETE for removal
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: isRemoving ? null : JSON.stringify({ resourceId: id }), // No body needed for DELETE
            });
    
            const data = await res.json();
            console.log("Favorite API Response:", data); // Debugging
    
            if (res.ok) {
                setFavorites((prev) =>
                    isRemoving ? prev.filter((favId) => favId !== id) : [...prev, id]
                );
    
                setSuccessMessage(isRemoving ? "Removed from favorites ❌" : "Added to favorites ✅");
    
                setTimeout(() => setSuccessMessage(""), 3000);
            } else {
                console.error("Failed to update favorites", data);
            }
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    };
    
    return (
        <div className='bg-gray-100 min-h-screen'>
            {/* ✅ Success Notification */}
            {successMessage && (
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-500">
                    {successMessage}
                </div>
            )}

            <div className="sticky top-0">
                <Navbar />
            </div>

            <h3 className='text-center text-gray-500 text-3xl font-semibold m-4'>Resource Center</h3>

            <div className='p-4'>
                <div className="flex justify-center gap-14 p-2 mb-6">
                    <button
                        className={`tab-button mr-5 ${activeTab === "news"
                            ? "border-b-4 border-blue-500 font-semibold text-blue-600"
                            : "text-gray-600"}`}
                        onClick={() => setActiveTab('news')}
                    >
                        News & Blog
                    </button>
                    <button
                        className={`tab-button ${activeTab === "articles"
                            ? "border-b-4 border-blue-500 font-semibold text-blue-600"
                            : "text-gray-600"}`}
                        onClick={() => setActiveTab('articles')}
                    >
                        Articles
                    </button>
                </div>

                {/* Filters */}
                <div className="flex justify-center mb-4">
                    {activeTab === 'news' && (
                        <div className="flex gap-2 overflow-x-auto hide-scrollbar p-2">
                            <button
                                className={`filter-button px-8 py-2 mx-2 rounded-full ${activeFilter === 'all' ? 'bg-blue-500 text-white' : 'border border-blue-500'}`}
                                onClick={() => handleFilter('all')}
                            >
                                All
                            </button>
                            <button
                                className={`filter-button px-8 py-2 mx-2 rounded-full ${activeFilter === 'favorites' ? 'bg-blue-500 text-white' : 'border border-blue-500'}`}
                                onClick={() => handleFilter('favorites')}
                            >
                                Favorites
                            </button>
                        </div>
                    )}

                    {activeTab === 'articles' && (
                        <div className="flex gap-2 overflow-x-auto hide-scrollbar p-2">
                            <button
                                className={`filter-button px-8 py-2 mx-2 rounded-full ${activeFilter === 'all' ? 'bg-blue-500 text-white' : 'border border-blue-500'}`}
                                onClick={() => handleFilter('all')}
                            >
                                All
                            </button>

                            <button
                                className={`filter-button px-8 py-2 mx-2 rounded-full ${activeFilter === 'favorites' ? 'bg-blue-500 text-white' : 'border border-blue-500'}`}
                                onClick={() => handleFilter('favorites')}
                            >
                                Favorites
                            </button>
                        </div>
                    )}
                </div>

                {activeTab === 'news' && (
                    <div className="news-tab">
                        {filteredContent(newsAndBlog).map((item, index) => {
                            // console.log("Timestamp received:", item.createdAt); // Debugging log

                            let formattedTimestamp = "No Date Available"; // Default fallback

                            if (item.createdAt) {  // Use `createdAt` for timestamp
                                const date = new Date(item.createdAt); // Convert string to Date object

                                if (!isNaN(date.getTime())) { // Ensure it's a valid date
                                    formattedTimestamp = new Intl.DateTimeFormat('en-US', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short',
                                    }).format(date);
                                }
                            }
                            return (
                                <div
                                    key={item._id || index} // Ensure uniqueness
                                    className="relative content-card mb-4 mx-3 p-4 bg-white border rounded shadow-sm"
                                >
                                    {/* Menu Button */}
                                    <div className="absolute top-2 right-2">
                                        <button onClick={() => handleMenuToggle(item._id)} className="text-gray-600">
                                            <FaEllipsisV />
                                        </button>
                                        {menuOpen === item._id && (
                                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg">
                                                <button
                                                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                                                    onClick={() => handleToggleFavorite(item._id)}
                                                >
                                                    {favorites.includes(item._id) ? "Remove from Favorites" : "Add to Favorites"}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-semibold">{item.title}</h3>
                                    <p className="text-gray-700">{item.description}</p>
                                    <p className="text-sm text-gray-500">{`Posted on: ${formattedTimestamp}`}</p>

                                    {/* Expandable Content */}
                                    <button
                                        className="text-blue-500 hover:underline"
                                        onClick={() => setExpandedCard(expandedCard === item._id ? null : item._id)}
                                    >
                                        {expandedCard === item._id ? 'Show Less' : 'Read More'}
                                    </button>
                                    {expandedCard === item._id && <p className="mt-2 text-gray-600">{item.content}</p>}

                                </div>

                            );
                        })}
                    </div>
                )}

                {activeTab === 'articles' && (
                    <div className="articles-tab">
                        {filteredContent(articles).map((item, index) => {
                            // console.log("Timestamp received:", createdAt); // Debugging log

                            let formattedTimestamp = "No Date Available"; // Default fallback

                            if (item.createdAt) {  // Use `createdAt` for timestamp
                                const date = new Date(item.createdAt); // Convert string to Date object

                                if (!isNaN(date.getTime())) { // Ensure it's a valid date
                                    formattedTimestamp = new Intl.DateTimeFormat('en-US', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short',
                                    }).format(date);
                                }
                            }

                            return (
                                <div
                                    key={item._id || index} // Ensure uniqueness
                                    className="relative content-card mb-4 mx-3 p-4 bg-white border rounded shadow-sm"
                                >
                                    {/* Menu Button */}
                                    <div className="absolute top-2 right-2">
                                        <button onClick={() => handleMenuToggle(item._id)} className="text-gray-600">
                                            <FaEllipsisV />
                                        </button>
                                        {menuOpen === item._id && (
                                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg">
                                                <button
                                                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                                                    onClick={() => handleToggleFavorite(item._id)}
                                                >
                                                    {favorites.includes(item._id) ? "Remove from Favorites" : "Add to Favorites"}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-semibold">{item.title}</h3>
                                    <p className="text-gray-700">{item.description}</p>
                                    <p className="text-sm text-gray-500">{`Posted on: ${formattedTimestamp}`}</p>

                                    {/* Expandable Section */}
                                    <button
                                        className="text-blue-500 hover:underline"
                                        onClick={() => setExpandedCard(expandedCard === item._id ? null : item._id)}
                                    >
                                        {expandedCard === item._id ? 'Show Less' : 'Read More'}
                                    </button>

                                    {expandedCard === item._id && (
                                        <div className="mt-2">
                                            <p className="text-gray-600"><strong>Causes:</strong> {item.causes}</p>
                                            <p className="text-gray-700"><strong>Diagnosis:</strong> {item.diagnosis}</p>
                                            <p className="text-gray-700"><strong>Treatment:</strong> {item.treatment}</p>

                                            {/* Exercises */}
                                            <h4 className="mt-2 font-semibold">Exercises:</h4>
                                            <ul className="list-disc pl-4">
                                                {item.exercise.split(',').map((exercise, index) => (
                                                    <li key={`${item._id || index}-exercise`}>
                                                        <a href="#" className="text-blue-500 hover:underline">
                                                            {exercise.trim()}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}


            </div>
        </div>
    );
};
export default ResourcePage;