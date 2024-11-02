// src/components/Results.js
import React from "react";

function Results({ jobs }) {
  return (
    <div className="w-full max-w-md mt-6">
      {jobs.length > 0 ? (
        jobs.map((job, index) => (
          <div key={index} className="p-4 border border-gray-300 rounded mb-4">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              View Job
            </a>
          </div>
        ))
      ) : (
        <p>No jobs found. Try a different search.</p>
      )}
    </div>
  );
}

export default Results;
