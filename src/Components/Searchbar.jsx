import React from 'react';

const SearchBar = ({ placeholder, onSearch }) => {
  return (
    <div className="w-96">
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm outline-none"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
