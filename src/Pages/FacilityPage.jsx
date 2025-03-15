import { useLocation, useNavigate } from "react-router-dom";
import LandingNavbar from "../Components/LandingNavbar";
import { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const FacilityPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const selectedLocation = queryParams.get("location");

    const [facilities, setFacilities] = useState([]);
    const [sponsoredAds, setSponsoredAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(selectedLocation || ""); // Default to URL location

    useEffect(() => {
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

        const fetchSponsoredAds = async () => {
            try {
                const response = await axios.get("https://authmern-backend-i3kc.onrender.com/api/advertisements");
                setSponsoredAds(response.data);
            } catch (error) {
                console.error("Error fetching sponsored ads:", error);
            }
        };

        fetchFacilities();
        fetchSponsoredAds();
    }, []);

    // Filter facilities based on search term
    const filteredFacilities = facilities.filter((facility) =>
        facility.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Reset filter to show all clinics
    const showAllClinics = () => {
        setSearchTerm(""); // Clear search input
        navigate("/facilityPage"); // Remove query params
    };

    // Carousel settings
    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <div>
            <LandingNavbar />

            {/* Sponsored Ads Carousel */}
            <div className="container mx-auto p-4">
                {sponsoredAds.length > 0 && (
                    <Slider {...carouselSettings} className="mb-6">
                        {sponsoredAds.map((ad, index) => (
                            <div key={index} className="p-4">
                                <img src={ad.image} alt={ad.title} className="w-full h-56 object-cover rounded-lg shadow-lg" />
                                <h2 className="text-center text-lg font-bold mt-2">{ad.title}</h2>
                                <p className="text-gray-600 text-sm">{ad.description}</p>
                                <a
                                    href={ad.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline mt-2 block"
                                >
                                    Visit Website
                                </a>
                            </div>
                        ))}
                    </Slider>
                )}

                {/* Search Bar */}
                <div className="flex justify-center mb-4">
                    <input
                        type="text"
                        placeholder="Search by location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg w-full max-w-md"
                    />
                </div>

                {/* Facilities List */}
                <h1 className="text-4xl text-center font-bold text-blue-900 mb-4">
                    {searchTerm ? `Facilities in "${searchTerm}"` : "All Facilities"}
                </h1>

                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : filteredFacilities.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {filteredFacilities.map((facility, index) => (
                            <div key={index} className="border border-gray-300 rounded-lg shadow-lg p-4 flex flex-col">
                                <h3 className="text-lg font-semibold text-blue-800 mb-1">{facility.title}</h3>
                                <p className="text-gray-700 text-sm">{facility.description}</p>
                                <p className="text-gray-600 font-medium mt-2">📍 {facility.location}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-gray-600">No facilities found in this location.</p>
                        <button
                            onClick={showAllClinics}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Show All Clinics
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FacilityPage;
