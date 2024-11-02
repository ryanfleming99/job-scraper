const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "your_mongodb_uri_here", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Job schema and model
const jobSchema = new mongoose.Schema({
  title: String,
  location: String,
  salary: String,
  post_date: String,
  description: String,
  link: String
});
const Job = mongoose.model("Job", jobSchema);

// Function to fetch jobs from Adzuna API and store them in MongoDB
const fetchAndStoreJobs = async (role, location) => {
  const apiUrl = `https://api.adzuna.com/v1/api/jobs/gb/search/1`;
  const params = {
    app_id: process.env.ADZUNA_APP_ID || "ADZUNA_APP_ID", // Store in .env for security
    app_key: process.env.ADZUNA_API_KEY || "ADZUNA_API_KEY", // Store in .env for security
    what: role,
    where: location,
    results_per_page: 10
  };

  try {
    const response = await axios.get(apiUrl, { params });
    const jobs = response.data.results;

    for (let job of jobs) {
      const jobData = {
        title: job.title,
        location: job.location.display_name,
        salary: job.salary_min
          ? `£${job.salary_min} - £${job.salary_max}`
          : "Not specified",
        post_date: job.created,
        description: job.description,
        link: job.redirect_url
      };

      // Upsert job data into MongoDB
      await Job.updateOne(
        { link: jobData.link },
        { $set: jobData },
        { upsert: true }
      );
    }
  } catch (error) {
    console.error("Error fetching jobs from Adzuna:", error);
  }
};

// API route to trigger fetching and storing jobs
app.get("/api/fetch-jobs", async (req, res) => {
  const { role, location } = req.query;
  try {
    await fetchAndStoreJobs(role, location);
    res.status(200).json({ message: "Jobs fetched and stored successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs from Adzuna" });
  }
});

// API route to retrieve jobs from MongoDB
app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
