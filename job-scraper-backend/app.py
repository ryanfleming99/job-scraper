# app.py
from flask import Flask, jsonify

app = Flask(__name__)


@app.route('/api/jobs')
def get_jobs():
    # Mock response - replace with actual database interaction
    return jsonify({"jobs": [{"title": "Software Engineer", "location": "Remote"}]})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
