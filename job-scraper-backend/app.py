# app.py
from dotenv import load_dotenv
import os
import requests
from flask_cors import CORS
from flask import Flask, request, jsonify
import sys
print(sys.path)


load_dotenv()

app = Flask(__name__)
CORS(app, origins=["https://topjobscraper.netlify.app"])


@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    role = request.args.get("role", "")
    location = request.args.get("location", "")

    # Print environment variables to confirm they are loaded
    print("ADZUNA_APP_ID:", os.getenv("ADZUNA_APP_ID"))
    print("ADZUNA_API_KEY:", os.getenv("ADZUNA_API_KEY"))

    api_url = "https://api.adzuna.com/v1/api/jobs/gb/search/1"
    params = {
        "app_id": os.getenv("ADZUNA_APP_ID"),
        "app_key": os.getenv("ADZUNA_API_KEY"),
        "what": role,
        "where": location,
        "results_per_page": 10
    }

    try:
        response = requests.get(api_url, params=params)
        response.raise_for_status()
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
        print(f"RequestException: {e}")
        return jsonify({"error": "Failed to fetch jobs from Adzuna API", "details": str(e)}), 500
    except Exception as e:
        print(f"General Exception: {e}")
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1337)
