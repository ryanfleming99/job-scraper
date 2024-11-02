// App.js
import React, { useState } from "react";
import Search from "./components/Search";
import Results from "./components/Results";

function App() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null); // State to store any errors

  const handleSearch = async (role, location) => {
    console.log("Searching for:", { role, location });

    const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/jobs?role=${role}&location=${location}`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Data fetched:", data);
      setJobs(data); // Set the fetched jobs
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Failed to fetch jobs. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">Job Search</h1>
      <Search onSearch={handleSearch} />
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <Results jobs={jobs} />
      {jobs.length === 0 && !error && (
        <p>No results to display yet. Try searching!</p>
      )}
    </div>
  );
}

export default App;
