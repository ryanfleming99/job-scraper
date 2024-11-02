// src/components/Search.js
import React, { useState } from "react";

function Search({ onSearch }) {
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    console.log("Submitting search:", { role, location }); // Debugging line
    onSearch(role, location);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md flex flex-col items-center space-y-4"
    >
      <input
        type="text"
        value={role}
        onChange={e => setRole(e.target.value)}
        placeholder="Job Title"
        className="p-2 border border-gray-300 rounded w-full"
      />
      <input
        type="text"
        value={location}
        onChange={e => setLocation(e.target.value)}
        placeholder="Location"
        className="p-2 border border-gray-300 rounded w-full"
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        Search
      </button>
    </form>
  );
}

export default Search;
