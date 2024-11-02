import React, { useState, useRef } from "react";
import Search from "./components/Search";
import Results from "./components/Results";
import "./index.css"; // or './App.css' if that’s where your Tailwind styles are

function App() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const resultsRef = useRef(null);

  const handleSearch = async (role, location) => {
    const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/jobs?role=${role}&location=${location}`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setJobs(data);
      setError(null);

      // Scroll down to results
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Failed to fetch jobs. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-white flex flex-col items-center">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold mb-8 text-gray-700">Job Search</h1>
        <Search onSearch={handleSearch} />
      </div>

      <div ref={resultsRef} className="w-full p-4">
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {jobs.length > 0 ? (
          <Results jobs={jobs} />
        ) : (
          !error && (
            <p className="text-center text-gray-500 mt-6">
              No results to display yet. Try searching!
            </p>
          )
        )}
      </div>
    </div>
  );
}

export default App;
