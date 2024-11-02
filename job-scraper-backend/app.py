# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
import logging

load_dotenv()  # Load environment variables from .env if available

app = Flask(__name__)
CORS(app, origins=["https://topjobscraper.netlify.app"])
logging.basicConfig(level=logging.INFO)


@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    role = request.args.get("role", "")
    location = request.args.get("location", "")

    # Ensure API credentials are loaded
    app_id = os.getenv("ADZUNA_APP_ID")
    api_key = os.getenv("ADZUNA_API_KEY")
    if not app_id or not api_key:
        logging.error("Adzuna API credentials are missing.")
        return jsonify({"error": "Server configuration error."}), 500

    api_url = "https://api.adzuna.com/v1/api/jobs/gb/search/1"
    params = {
        "app_id": app_id,
        "app_key": api_key,
        "what": role,
        "where": location,
        "results_per_page": 10
    }

    try:
        logging.info("Sending request to Adzuna with params: %s", params)
        response = requests.get(api_url, params=params)
        response.raise_for_status()  # Raises an HTTPError if status is 4xx, 5xx

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

        return jsonify(job_data)
    except requests.exceptions.RequestException as e:
        logging.error("Error fetching jobs from Adzuna: %s", e)
        return jsonify({"error": "Failed to fetch jobs from Adzuna API"}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
