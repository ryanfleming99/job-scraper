import sqlite3


def init_db():
    conn = sqlite3.connect('jobs.db')
    c = conn.cursor()
    c.execute(
        '''CREATE TABLE IF NOT EXISTS jobs (id INTEGER PRIMARY KEY, title TEXT, link TEXT)''')
    conn.commit()
    conn.close()


def add_job(title, link):
    conn = sqlite3.connect('jobs.db')
    c = conn.cursor()
    c.execute("INSERT INTO jobs (title, link) VALUES (?, ?)", (title, link))
    conn.commit()
    conn.close()


def get_jobs():
    conn = sqlite3.connect('jobs.db')
    c = conn.cursor()
    c.execute("SELECT * FROM jobs")
    jobs = c.fetchall()
    conn.close()
    return jobs


# Initialize DB once
init_db()
