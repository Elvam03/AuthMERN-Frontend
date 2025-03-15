import { useEffect, useState, useContext, useRef } from "react";
import socket from "../utils/socket";
import { Navigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import AuthContext from "../Context/authContext";
import axios from "axios";

const ForumSection = () => {
    const { user } = useContext(AuthContext);

    if (!user) return <Navigate to="/login" />;

    const chatContainerRef = useRef(null); // Reference for auto-scrolling
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [profilePic, setProfilePic] = useState("");

    // Fetch user's profile picture from backend
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(
                    `https://authmern-backend-i3kc.onrender.com/api/profile/${user.userId}`
                );
                console.log("User Profile Response:", response.data);
                setProfilePic(response.data.profileImage || "/Images/noprofile.png");
            } catch (error) {
                console.error("Error fetching user profile:", error);
                setProfilePic("/Images/noprofile.png");
            }
        };

        fetchUserProfile();
    }, [user.userId]);

    // Fetch previous chat messages and auto-scroll
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/chats");
                const data = await res.json();
                console.log("Fetched messages:", data);

                if (Array.isArray(data)) {
                    setMessages(data);
                } else {
                    console.error("Expected an array but got:", data);
                    setMessages([]);
                }
            } catch (error) {
                console.error("Error fetching chat history:", error);
                setMessages([]);
            }
        };

        fetchMessages();
    }, []);

    // Auto-scroll to latest message when messages update
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]); // Runs whenever messages change

    // Listen for real-time messages
    useEffect(() => {
        socket.on("newChats", (newMessage) => {
            console.log("New message received:", newMessage);
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => {
            socket.off("newChats");
        };
    }, []);

    // Send a message
    const sendMessage = async () => {
        if (message.trim()) {
            const newMessage = {
                userId: user.userId,
                text: message,
            };

            try {
                await axios.post("http://localhost:5000/api/chats/send", newMessage);
            } catch (error) {
                console.error("Error sending message:", error);
            }

            setMessage("");
        }
    };

    return (
        <div>
            <div className="sticky top-0">
                <Navbar />
            </div>
            <div className="max-w-lg mx-auto p-4 bg-gray-100 shadow-lg rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Forum Chat</h2>

                {/* Chat container with auto-scroll */}
                <div ref={chatContainerRef} className="h-72 overflow-y-auto bg-white p-3 rounded shadow space-y-3">
                    {Array.isArray(messages) && messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex items-start gap-2 ${
                                msg.username === user.firstName ? "justify-end" : "justify-start"
                            }`}
                        >
                            {msg.username !== user.firstName && (
                                <img
                                    src={msg.profileImage || "/Images/noprofile.png"}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full"
                                />
                            )}
                            <div
                                className={`p-3 rounded-lg shadow ${
                                    msg.username === user.firstName
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-800"
                                }`}
                            >
                                <p className="text-sm">
                                    <strong>{msg.username}</strong>
                                </p>
                                <p className="text-base">{msg.text}</p>
                            </div>
                            {msg.username === user.firstName && (
                                <img
                                    src={msg.profileImage || "/Images/noprofile.png"}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full"
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Input field */}
                <div className="flex mt-3 items-center">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 p-2 border rounded"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                        onClick={sendMessage}
                        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForumSection;
