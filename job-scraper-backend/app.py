# app.py
from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

# Endpoint to fetch jobs from Adzuna based on search query


@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    # Get the job title from the user input
    role = request.args.get("role", "")
    # Get the location from the user input
    location = request.args.get("location", "")

    api_url = "https://api.adzuna.com/v1/api/jobs/gb/search/1"
    params = {
        # Adzuna App ID from environment variable
        "app_id": os.getenv("f3cbbc43"),
        # Adzuna API Key from environment variable
        "app_key": os.getenv("23c80a1ecdb081286a841d1c78149223"),
        "what": role,  # Use user-provided role
        "where": location,  # Use user-provided location
        "results_per_page": 10
    }

    try:
        response = requests.get(api_url, params=params)
        response.raise_for_status()  # Raise an error for bad responses

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
