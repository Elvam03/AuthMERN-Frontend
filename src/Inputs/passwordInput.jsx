import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="relative w-full text-sm border py-4 my-3 px-3 text-gray-500 flex items-center">
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Password"}
        type={isShowPassword ? "text" : "password"}
        className="w-full text-sm outline-none pr-10"
      />

      {isShowPassword ? (
        <FaRegEyeSlash
          size={22}
          className="text-gray-500 cursor-pointer absolute right-3"
          onClick={toggleShowPassword}
        />
      ) : (
        <FaRegEye
          size={22}
          className="text-gray-500 cursor-pointer absolute right-3"
          onClick={toggleShowPassword}
        />
      )}
    </div>
  );
};

export default PasswordInput;
