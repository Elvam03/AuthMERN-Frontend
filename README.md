# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { FaEllipsisV } from 'react-icons/fa';
import { Navigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const ResourcePage = () => {

  if (!user) return <Navigate to="/login" />;
  const { user } = useContext(AuthContext);

    const [activeTab, setActiveTab] = useState('news');
    const [expandedCard, setExpandedCard] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [menuOpen, setMenuOpen] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");

    const newsAndBlog = [
        {
            id: 1,
            title: "AI-Powered Physiotherapy in Scotland",
            description: "Physiotherapy and AI",
            content: "Scotland has introduced 'Kirsty' an AI-powered virtual physiotherapist, to address back pain and reduce NHS waiting times. ",
        },
        {
            id: 2,
            title: "Aquatic Therapy, a rising trend in Physical Therapy",
            description: "Discover what's new in the world of physiotherapy.",
            content: "The field is witnessing advancements in technology, including the adoption of aquatic therapy. Also known as hydrotherapy, this therapeutic technique offers a low-impact environment for rehabilitation. Aquatic therapy is recognized for its therapeutic ",
        },

    ];

    const articles = [
        {
            id: 1,
            title: "Understanding Chronic Pain",
            description: "An in-depth look at chronic pain.",
            timestamp: "2025-01-28T10:30:00",
            
        },
        {
            id: 2,
            title: "Benefits of Regular Exercise",
            description: "Why staying active is essential for health.",
            timestamp: "2025-01-28T10:30:00",
           
        },
    ];

    const handleFilter = (filter) => {
        setActiveFilter(filter);
    };

    const filteredContent = (data) => {
        if (activeFilter === 'favorites') {
            return data.filter((item) => favorites.includes(item.id));
        }
        if (activeFilter === 'latest' && activeTab === 'news') {
            return data.filter((item) => new Date(item.timestamp) > Date.now() - 7 * 24 * 60 * 60 * 1000);
        }
        return data;
    };

    const handleMenuToggle = (id) => {
        setMenuOpen(menuOpen === id ? null : id);
    };


    const handleShare = (id) => {
        console.log(`Shared item ${id}`);
        setMenuOpen(null);
    };

    const handleToggleFavorite = (id) => {
        if (favorites.includes(id)) {
            setFavorites(favorites.filter((favId) => favId !== id));
            setSuccessMessage("Removed from favorites ❌");
        } else {
            setFavorites([...favorites, id]);
            setSuccessMessage("Added to favorites ✅");
        }

        setTimeout(() => {
            setSuccessMessage("");
        }, 3000);

        setMenuOpen(null);
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
                        {filteredContent(newsAndBlog).map((item) => {
                            const formattedTimestamp = new Intl.DateTimeFormat('en-US', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                            }).format(new Date(item.timestamp));

                            return (
                                <div key={item.id} className="relative content-card mb-4 mx-3 p-4 bg-white border rounded shadow-sm">
                                    <div className="absolute top-2 right-2">
                                        <button onClick={() => handleMenuToggle(item.id)} className="text-gray-600">
                                            <FaEllipsisV />
                                        </button>
                                        {menuOpen === item.id && (


                                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg">
                                                <button
                                                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                                                    onClick={() => handleToggleFavorite(item.id)}
                                                >
                                                    {favorites.includes(item.id) ? "Remove from Favorites" : "Add to Favorites"}
                                                </button>
                                            </div>


                                        )}
                                    </div>

                                    <h3 className="text-xl font-semibold">{item.title}</h3>
                                    <p className="text-gray-700">{item.description}</p>
                                    <p className="text-sm text-gray-500">{`Posted on: ${formattedTimestamp}`}</p>
                                    <button
                                        className="text-blue-500 hover:underline"
                                        onClick={() => setExpandedCard(expandedCard === item.id ? null : item.id)}
                                    >
                                        {expandedCard === item.id ? 'Show Less' : 'Read More'}
                                    </button>
                                    {expandedCard === item.id && <p className="mt-2 text-gray-600">{item.content}</p>}
                                </div>
                            );
                        })}
                    </div>
                )}

                {activeTab === 'articles' && (
                    <div className="articles-tab">
                        {filteredContent(articles).map(item => (
                            <div key={item.id} className="relative content-card mb-4 mx-3 p-4 bg-white border rounded shadow-sm">
                                <div className="absolute top-2 right-2">
                                    <button onClick={() => handleMenuToggle(item.id)} className="text-gray-600">
                                        <FaEllipsisV />
                                    </button>
                                    {menuOpen === item.id && (
                                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg">
                                            <button
                                                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                                                onClick={() => handleToggleFavorite(item.id)}
                                            >
                                                {favorites.includes(item.id) ? "Remove from Favorites" : "Add to Favorites"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-xl font-semibold">{item.title}</h3>
                                <p className="text-gray-700">{item.description}</p>
                                <p className="text-sm text-gray-500">{`Posted on: ${new Date(item.timestamp).toLocaleString()}`}</p>
                                <button
                                    className="text-blue-500 hover:underline"
                                    onClick={() => setExpandedCard(expandedCard === item.id ? null : item.id)}
                                >
                                    {expandedCard === item.id ? 'Show Less' : 'Read More'}
                                </button>
                                {expandedCard === item.id && (
                                    <div className="mt-2">
                                        <p className="text-gray-600"><strong>Causes:</strong> {item.causes}</p>
                                        <p className="text-gray-700"><strong>Diagnosis:</strong> {item.diagnosis}</p>
                                        <p className="text-gray-700"><strong>Treatment:</strong> {item.treatment}</p>

                                        <h4 className="mt-2 font-semibold">Exercises:</h4>
                                        <ul className="list-disc pl-4">
                                            {item.exercise.split(',').map((exercise, index) => (
                                                <li key={index}>
                                                    <a href={`#`} className="text-blue-500 hover:underline">
                                                        {exercise.trim()}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default ResourcePage;

// models/Resource.js
const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['news', 'blog', 'article'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', ResourceSchema);

// models/UserFavorite.js
const UserFavoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }]
});

module.exports = mongoose.model('UserFavorite', UserFavoriteSchema);

// routes/resourceRoutes.js
const express = require('express');
const Resource = require('../models/Resource');
const UserFavorite = require('../models/UserFavorite');
const router = express.Router();

// Add a resource
router.post('/add', async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const newResource = new Resource({ title, content, category });
    await newResource.save();
    res.status(201).json(newResource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all resources
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add/remove a resource from favorites
router.post('/favorites', async (req, res) => {
  try {
    const { userId, resourceId } = req.body;
    let userFavorites = await UserFavorite.findOne({ userId });
    if (!userFavorites) {
      userFavorites = new UserFavorite({ userId, resources: [] });
    }
    
    const index = userFavorites.resources.indexOf(resourceId);
    if (index === -1) {
      userFavorites.resources.push(resourceId);
    } else {
      userFavorites.resources.splice(index, 1);
    }
    await userFavorites.save();
    res.json(userFavorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's favorite resources
router.get('/favorites/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userFavorites = await UserFavorite.findOne({ userId }).populate('resources');
    res.json(userFavorites ? userFavorites.resources : []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
