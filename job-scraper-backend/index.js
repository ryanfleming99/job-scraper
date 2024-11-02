const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const axios = require("axios");
const mongoose = require("mongoose");

const Job = mongoose.model(
  "Job",
  new mongoose.Schema({
    title: String,
    location: String,
    salary: String,
    post_date: String,
    description: String,
    link: String
  })
);

const fetchAndStoreJobs = async (role, location) => {
  const apiUrl = `https://api.adzuna.com/v1/api/jobs/gb/search/1`;
  const params = {
    app_id: "yf3cbbc43", // Replace with your Adzuna app ID
    app_key: "23c80a1ecdb081286a841d1c78149223", // Replace with your Adzuna API key
    what: role,
    where: location,
    results_per_page: 10
  };

  try {
    const response = await axios.get(apiUrl, { params });
    const jobs = response.data.results;

    // Save each job to MongoDB
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

      // Upsert (update if exists, otherwise insert)
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

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://ryanfleming:sUN9uV2iIcjtxiP9@cluster0.mongodb.net/jobDB?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const jobSchema = new mongoose.Schema({
  title: String,
  location: String,
  link: String,
  description: String
});

const Job = mongoose.model("Job", jobSchema);

// API route to fetch jobs
app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// API route to add jobs (for scraping or manual addition)
app.post("/api/jobs", async (req, res) => {
  const { title, location, link, description } = req.body;
  const job = new Job({ title, location, link, description });
  await job.save();
  res.status(201).json(job);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
