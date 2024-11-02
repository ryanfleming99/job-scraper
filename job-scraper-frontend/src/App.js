// App.js
import React, { useState } from "react";
import Search from "./components/Search";
import Results from "./components/Results";

function App() {
  const [jobs, setJobs] = useState([]);

  const handleSearch = async (role, location) => {
    console.log("handleSearch called with:", { role, location });

    // Use the environment variable for the API base URL
    const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/jobs?role=${role}&location=${location}`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data fetched:", data);
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">Job Search</h1>
      <Search onSearch={handleSearch} />
      <Results jobs={jobs} />
      {jobs.length === 0 && <p>No results to display yet. Try searching!</p>}
    </div>
  );
}

export default App;
