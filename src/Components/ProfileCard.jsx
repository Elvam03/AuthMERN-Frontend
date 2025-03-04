import React, { useContext } from "react";
import AuthContext from "../Context/authContext";

const ProfileCard = () => {
  const { user } = useContext(AuthContext);

  if (!user || !user.firstName || !user.secondName) return null; // Ensure names exist

  // Function to capitalize the first letter of a string
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Generate initials
  const getInitials = (firstName, secondName) => {
    return `${firstName[0]}${secondName ? secondName[0] : ""}`.toUpperCase();
  };

  return (
    <div className="flex items-center">
      {/* Initials Avatar */}
      <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
        {getInitials(user.firstName, user.secondName)}
      </div>

      {/* Name */}
      <div className="ml-4">
      {capitalize(user.firstName)} {capitalize(user.secondName)}
      </div>
    </div>
  );
};

export default ProfileCard;
