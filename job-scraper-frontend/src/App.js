// App.js
import React, { useState } from "react";
import Search from "./components/Search";
import Results from "./components/Results";

function App() {
  const [jobs, setJobs] = useState([]);

  const handleSearch = async (role, location) => {
    try {
      console.log("Fetching and storing jobs for:", { role, location }); // Debugging line

      // Step 1: Fetch jobs from Adzuna and store in MongoDB
      await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/fetch-jobs?role=${role}&location=${location}`
      );

      // Step 2: Retrieve stored jobs from MongoDB
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/jobs?role=${role}&location=${location}`
      );
      const data = await response.json();
      console.log("Jobs data retrieved:", data); // Debugging line
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
