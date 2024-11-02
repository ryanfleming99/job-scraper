const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://<username>:<password>@cluster0.mongodb.net/jobDB?retryWrites=true&w=majority",
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
