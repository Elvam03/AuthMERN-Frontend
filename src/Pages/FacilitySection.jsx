import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../Components/LandingNavbar";

const FacilitySection = () => {
    const [selectedLocation, setSelectedLocation] = useState("");
    const [advertisements, setAdvertisements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const locations = ["Mombasa", "Kakamega", "Nairobi", "Eldoret", "Nakuru", "Kisumu", "Lamu", "Kisii", "Busia"];

    useEffect(() => {
        const fetchAdvertisements = async () => {
            try {
                const response = await fetch("https://authmern-backend-i3kc.onrender.com/api/advertisements"); // Adjust the endpoint
                if (!response.ok) {
                    throw new Error("Failed to fetch advertisements");
                }
                const data = await response.json();
                setAdvertisements(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAdvertisements();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div className="min-h-screen">
            <LandingNavbar />

            <div className="container mx-auto p-4 my-5 min-h-screen">
                <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto mb-10 mt-5">
                    <h1 className="text-4xl text-center font-bold text-blue-900 mb-4">Our Facilities</h1>
                    <h3 className="text-2xl font-semibold text-center m-3 text-gray-500">Sponsored:</h3>

                    {loading ? (
                        <p className="text-center">Loading advertisements...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : (
                        <Slider {...settings}>
                            {advertisements.map((ad, index) => (
                                <div key={index} className="border rounded-lg shadow-lg p-4">
                                    <img src={ad.image} alt={ad.title} className="w-full h-48 object-cover rounded-md mb-2" />
                                    <h3 className="text-lg font-semibold">{ad.title}</h3>
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
                </div>

                <h1 className="text-2xl font-semibold text-center mt-6 text-gray-500">Locations:</h1>
                <div className="flex flex-col mt-3 mb-6">
                    <button
                        onClick={() => navigate("/facilityPage")}
                        className="text-blue-600 hover:underline"
                    >
                        All Facilities
                    </button>
                    {locations.map((location) => (
                        <button
                            key={location}
                            onClick={() => navigate(`/facilityPage?location=${location}`)}
                            className="text-blue-600 hover:underline"
                        >
                            Clinics in {location}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FacilitySection;
