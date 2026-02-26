-- ==========================================
-- JOB PORTAL DATABASE SCHEMA
-- ==========================================

PRAGMA foreign_keys = ON;

-- ==========================================
-- USERS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('jobseeker','employer','admin')) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- JOB SEEKER PROFILE
-- ==========================================

CREATE TABLE IF NOT EXISTS job_seeker_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    mobile TEXT,
    profile_headline TEXT,
    current_location TEXT,
    preferred_locations TEXT,
    experience_years INTEGER,
    experience_months INTEGER,
    current_salary INTEGER,
    expected_salary INTEGER,
    notice_period TEXT,
    resume_headline TEXT,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- ==========================================
-- COMPANIES
-- ==========================================

CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    website TEXT,
    industry TEXT,
    size TEXT,
    verification_status TEXT DEFAULT 'unverified',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- EMPLOYERS
-- ==========================================

CREATE TABLE IF NOT EXISTS employers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    company_id INTEGER,
    recruiter_name TEXT,
    designation TEXT,
    mobile TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(company_id) REFERENCES companies(id)
);

-- ==========================================
-- JOBS
-- ==========================================

CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employer_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    job_type TEXT,
    experience_min INTEGER,
    experience_max INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(employer_id) REFERENCES employers(id)
);

-- ==========================================
-- APPLICATIONS
-- ==========================================

CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER,
    user_id INTEGER,
    resume_id INTEGER,
    cover_letter TEXT,
    status TEXT DEFAULT 'applied',
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, user_id),
    FOREIGN KEY(job_id) REFERENCES jobs(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- ==========================================
-- SKILLS
-- ==========================================

CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS user_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    skill_id INTEGER,
    proficiency TEXT,
    experience_years INTEGER,
    UNIQUE(user_id, skill_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(skill_id) REFERENCES skills(id)
);

CREATE TABLE IF NOT EXISTS job_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER,
    skill_id INTEGER,
    FOREIGN KEY(job_id) REFERENCES jobs(id),
    FOREIGN KEY(skill_id) REFERENCES skills(id)
);

-- ==========================================
-- WORK EXPERIENCE
-- ==========================================

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
);

-- ==========================================
-- EDUCATION
-- ==========================================

CREATE TABLE IF NOT EXISTS education (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    degree TEXT,
    institution TEXT,
    graduation_year INTEGER,
    specialization TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- ==========================================
-- SAVED JOBS
-- ==========================================

CREATE TABLE IF NOT EXISTS saved_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    job_id INTEGER,
    saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, job_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(job_id) REFERENCES jobs(id)
);

-- ==========================================
-- JOB ALERTS
-- ==========================================

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
);

-- ==========================================
-- MESSAGES
-- ==========================================

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
);

-- ==========================================
-- COMPANY REVIEWS
-- ==========================================

CREATE TABLE IF NOT EXISTS company_reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER,
    user_id INTEGER,
    overall_rating INTEGER,
    work_life_balance INTEGER,
    compensation INTEGER,
    culture INTEGER,
    career_growth INTEGER,
    title TEXT,
    pros TEXT,
    cons TEXT,
    employment_status TEXT,
    job_title TEXT,
    years_worked INTEGER,
    recommend INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(company_id) REFERENCES companies(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- ==========================================
-- ANALYTICS TABLES
-- ==========================================

CREATE TABLE IF NOT EXISTS profile_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    viewer_id INTEGER,
    viewed_user_id INTEGER,
    company_name TEXT,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(viewer_id) REFERENCES users(id),
    FOREIGN KEY(viewed_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS job_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER,
    viewer_id INTEGER,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(job_id) REFERENCES jobs(id),
    FOREIGN KEY(viewer_id) REFERENCES users(id)
);

-- ==========================================
-- SUBSCRIPTION PLANS
-- ==========================================

CREATE TABLE IF NOT EXISTS subscription_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    price INTEGER,
    duration TEXT,
    credits INTEGER,
    features TEXT
);