const express = require("express");
const db = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const profileRoutes = require("./routes/profileRoutes");
const savedJobsRoutes = require("./routes/savedJobsRoutes");
const jobAlertsRoutes = require("./routes/jobAlertsRoutes");
const workExperienceRoutes = require("./routes/workExperienceRoutes");
const educationRoutes = require("./routes/educationRoutes");
const skillsRoutes = require("./routes/skillsRoutes");
const employerRoutes = require("./routes/employerRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const companyRoutes = require("./routes/companyRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

const app = express();

app.use(express.json());


// Create users table
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT CHECK(role IN ('jobseeker','employer')) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
        db.run(`
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            location TEXT NOT NULL,
            salary INTEGER,
            company_name TEXT NOT NULL,
            created_by INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (created_by) REFERENCES users(id)
        )
    `);
        db.run(`
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            job_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            status TEXT DEFAULT 'applied',
            applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (job_id) REFERENCES jobs(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);
db.run(`
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
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
`);
db.run(`
    CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        industry TEXT,
        size TEXT,
        website TEXT,
        verification_status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);
db.run(`
    CREATE TABLE IF NOT EXISTS employers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE,
        company_id INTEGER,
        recruiter_name TEXT,
        designation TEXT,
        mobile TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (company_id) REFERENCES companies(id)
    )
`);
db.run(`
    CREATE TABLE IF NOT EXISTS resumes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        resume_name TEXT,
        resume_file TEXT,
        is_primary INTEGER DEFAULT 0,
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
`);


});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/saved-jobs", savedJobsRoutes);
app.use("/api/job-alerts", jobAlertsRoutes);
app.use("/api/profile/experience", workExperienceRoutes);
app.use("/api/profile/education", educationRoutes);
app.use("/api/profile/skills", skillsRoutes);
app.use("/api/employer", employerRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

app.get("/", (req, res) => {
    res.send("Job Portal Backend Running ");
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
