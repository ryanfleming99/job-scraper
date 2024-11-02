import React from "react";

function Results({ jobs }) {
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {jobs.map((job, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition"
        >
          <h3 className="text-lg font-semibold text-blue-800">{job.title}</h3>
          <p className="text-gray-600">{job.location}</p>
          <p className="text-gray-500">{job.salary || "Not specified"}</p>
          <p className="text-gray-400">
            {new Date(job.post_date).toLocaleDateString()}
          </p>
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline mt-2 block"
          >
            View Job
          </a>
        </div>
      ))}
    </div>
  );
}

export default Results;
