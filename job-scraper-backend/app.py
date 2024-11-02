# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS to handle cross-origin requests
import requests
import os
from dotenv import load_dotenv


app = Flask(__name__)

# Enable CORS for the Netlify frontend
CORS(app, origins=["https://topjobscraper.netlify.app"])

# Endpoint to fetch jobs from Adzuna based on search query


@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    role = request.args.get("role", "")  # Get the job title from user input
    # Get the location from user input
    location = request.args.get("location", "")

    api_url = "https://api.adzuna.com/v1/api/jobs/gb/search/1"
    params = {
        # Retrieve Adzuna App ID from environment variable
        "app_id": os.getenv("ADZUNA_APP_ID"),
        # Retrieve Adzuna API Key from environment variable
        "app_key": os.getenv("ADZUNA_API_KEY"),
        "what": role,
        "where": location,
        "results_per_page": 10
    }

    try:
        response = requests.get(api_url, params=params)
        response.raise_for_status()  # Raise an error for non-2xx responses

        # Extract and format job results from Adzuna API response
        jobs = response.json().get("results", [])
        job_data = [
            {
                "title": job["title"],
                "location": job["location"]["display_name"],
                "salary": f"£{job['salary_min']} - £{job['salary_max']}" if job.get("salary_min") else "Not specified",
                "post_date": job["created"],
                "description": job["description"],
                "link": job["redirect_url"]
            }
            for job in jobs
        ]

        return jsonify(job_data)  # Return the job data as JSON
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
