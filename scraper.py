import requests
from bs4 import BeautifulSoup
import time

BASE_URL = 'https://www.totaljobs.com/jobs/{role}?location={location}'

def scrape_jobs(role, location):
    url = BASE_URL.format(role=role, location=location)
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        # Customize based on site HTML structure; example job container:
        jobs = []
        for job in soup.find_all('div', class_='job-item'):
            title = job.find('h2').text.strip()
            link = job.find('a')['href']
            jobs.append({'title': title, 'link': link})
        return jobs
    else:
        print("Error fetching data.")
        return []

# Scrape every 15 mins
if __name__ == "__main__":
    while True:
        jobs = scrape_jobs('developer', 'London')
        # Save jobs to database or JSON file
        time.sleep(900)  # Sleep for 15 minutes
