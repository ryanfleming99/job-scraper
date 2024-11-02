import React, { useState } from "react";

function Search({ onSearch }) {
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    onSearch(role, location);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md text-center space-y-4"
    >
      <input
        type="text"
        value={role}
        onChange={e => setRole(e.target.value)}
        placeholder="Job Title"
        className="p-3 border border-gray-300 rounded-lg w-full"
      />
      <input
        type="text"
        value={location}
        onChange={e => setLocation(e.target.value)}
        placeholder="Location"
        className="p-3 border border-gray-300 rounded-lg w-full"
      />
      <button
        type="submit"
        className="p-3 bg-blue-600 text-white rounded-lg w-full hover:bg-blue-700 transition"
      >
        Search
      </button>
    </form>
  );
}

export default Search;
