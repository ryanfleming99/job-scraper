// src/components/Results.js
import React from "react";

function Results({ jobs }) {
  return (
    <div className="mt-6 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {jobs.length > 0 ? (
        jobs.map((job, index) => (
          <div key={index} className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p className="text-gray-500">{job.location}</p>
            <p className="text-gray-400">{job.salary || "Not specified"}</p>
            <p className="text-gray-400">
              {new Date(job.post_date).toLocaleDateString()}
            </p>
          </div>
        ))
      ) : (
        <p>No job results found.</p>
      )}
    </div>
  );
}

export default Results;
