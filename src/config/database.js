const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../../database/jobportal.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log("Connected to SQLite database ✅");
    }
});
db.run(`
CREATE TABLE IF NOT EXISTS saved_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    job_id INTEGER,
    saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, job_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(job_id) REFERENCES jobs(id)
)
`);
db.run(`
CREATE TABLE IF NOT EXISTS job_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    keywords TEXT,
    location TEXT,
    experience TEXT,
    frequency TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
)
`);
db.run(`
CREATE TABLE IF NOT EXISTS work_experience (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    company TEXT,
    designation TEXT,
    location TEXT,
    start_date TEXT,
    end_date TEXT,
    currently_working INTEGER DEFAULT 0,
    responsibilities TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
)
`);
db.run(`
CREATE TABLE IF NOT EXISTS education (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    degree TEXT,
    institution TEXT,
    graduation_year INTEGER,
    specialization TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
)
`);
db.run(`
CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS user_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    skill_id INTEGER,
    proficiency TEXT,
    experience_years INTEGER,
    UNIQUE(user_id, skill_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(skill_id) REFERENCES skills(id)
)
`);
db.run(`
CREATE TABLE IF NOT EXISTS job_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER,
    skill_id INTEGER,
    is_mandatory INTEGER DEFAULT 1,
    UNIQUE(job_id, skill_id),
    FOREIGN KEY(job_id) REFERENCES jobs(id),
    FOREIGN KEY(skill_id) REFERENCES skills(id)
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employer_id INTEGER,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(employer_id) REFERENCES users(id)
)
`);
db.run(`
CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    job_id INTEGER,
    status TEXT DEFAULT 'applied',
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, job_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(job_id) REFERENCES jobs(id)
)
`);
db.run(`
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER,
    receiver_id INTEGER,
    subject TEXT,
    message TEXT,
    job_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(sender_id) REFERENCES users(id),
    FOREIGN KEY(receiver_id) REFERENCES users(id),
    FOREIGN KEY(job_id) REFERENCES jobs(id)
)
`);
// Profile views tracking
db.run(`
CREATE TABLE IF NOT EXISTS profile_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    viewer_id INTEGER,
    viewed_user_id INTEGER,
    company_name TEXT,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(viewer_id) REFERENCES users(id),
    FOREIGN KEY(viewed_user_id) REFERENCES users(id)
)
`);

// Job analytics tracking
db.run(`
CREATE TABLE IF NOT EXISTS job_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER,
    viewer_id INTEGER,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(job_id) REFERENCES jobs(id),
    FOREIGN KEY(viewer_id) REFERENCES users(id)
)
`);
db.run(`
CREATE TABLE IF NOT EXISTS subscription_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT, -- jobseeker or employer
    price INTEGER,
    duration TEXT,
    credits INTEGER,
    features TEXT
)
`);
// Seed sample subscription plans
db.run(`
INSERT OR IGNORE INTO subscription_plans 
(id, name, type, price, duration, credits, features)
VALUES
(1, 'Premium Job Seeker', 'jobseeker', 999, '3 months', NULL,
 'Priority in search results,See recruiter contact info,Profile boost'),
 
(2, 'Ultimate Job Seeker', 'jobseeker', 1999, '6 months', NULL,
 'All premium features,Featured profile,Resume review'),

(101, 'Starter Pack', 'employer', 5000, NULL, 10,
 'Post 10 jobs,Database access - 50 profiles,Priority listing'),

(102, 'Pro Recruiter Pack', 'employer', 15000, NULL, 50,
 'Post 50 jobs,Unlimited profile search,Featured jobs')
`);

module.exports = db;
