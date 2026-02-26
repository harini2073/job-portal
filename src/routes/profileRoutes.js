const express = require("express");
const router = express.Router();
const db = require("../config/database");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/profile (Jobseeker only)
router.get("/", authMiddleware, (req, res) => {
    if (req.user.role !== "jobseeker") {
        return res.status(403).json({
            message: "Only jobseekers can access profile"
        });
    }

    db.get(
        `SELECT users.id, users.name, users.email,
                job_seeker_profiles.mobile,
                job_seeker_profiles.profile_headline,
                job_seeker_profiles.current_location,
                job_seeker_profiles.preferred_locations,
                job_seeker_profiles.experience_years,
                job_seeker_profiles.experience_months,
                job_seeker_profiles.current_salary,
                job_seeker_profiles.expected_salary,
                job_seeker_profiles.notice_period
         FROM users
         LEFT JOIN job_seeker_profiles
         ON users.id = job_seeker_profiles.user_id
         WHERE users.id = ?`,
        [req.user.id],
        (err, profile) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(200).json({
                profile: profile
            });
        }
    );
});
// PUT /api/profile (Jobseeker only)
router.put("/", authMiddleware, (req, res) => {
    if (req.user.role !== "jobseeker") {
        return res.status(403).json({
            message: "Only jobseekers can update profile"
        });
    }

    const {
        mobile,
        profile_headline,
        current_location,
        preferred_locations,
        experience_years,
        experience_months,
        current_salary,
        expected_salary,
        notice_period
    } = req.body;

    // Check if profile already exists
    db.get(
        `SELECT * FROM job_seeker_profiles WHERE user_id = ?`,
        [req.user.id],
        (err, existingProfile) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (existingProfile) {
                // Update profile
                db.run(
                    `UPDATE job_seeker_profiles
                     SET mobile = ?, profile_headline = ?, current_location = ?,
                         preferred_locations = ?, experience_years = ?,
                         experience_months = ?, current_salary = ?,
                         expected_salary = ?, notice_period = ?,
                         updated_at = CURRENT_TIMESTAMP
                     WHERE user_id = ?`,
                    [
                        mobile,
                        profile_headline,
                        current_location,
                        preferred_locations,
                        experience_years,
                        experience_months,
                        current_salary,
                        expected_salary,
                        notice_period,
                        req.user.id
                    ],
                    function (err) {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }

                        res.status(200).json({
                            message: "Profile updated successfully"
                        });
                    }
                );
            } else {
                // Insert new profile
                db.run(
                    `INSERT INTO job_seeker_profiles
                     (user_id, mobile, profile_headline, current_location,
                      preferred_locations, experience_years, experience_months,
                      current_salary, expected_salary, notice_period)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        req.user.id,
                        mobile,
                        profile_headline,
                        current_location,
                        preferred_locations,
                        experience_years,
                        experience_months,
                        current_salary,
                        expected_salary,
                        notice_period
                    ],
                    function (err) {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }

                        res.status(201).json({
                            message: "Profile created successfully"
                        });
                    }
                );
            }
        }
    );
});

// POST /api/profile/resume/upload
router.post("/resume/upload", authMiddleware, (req, res) => {

    if (req.user.role !== "jobseeker") {
        return res.status(403).json({
            message: "Only jobseekers can upload resumes"
        });
    }

    const { resumeFile, resumeName, isPrimary } = req.body;

    if (!resumeFile || !resumeName) {
        return res.status(400).json({
            message: "resumeFile and resumeName are required"
        });
    }

    // If isPrimary = true → reset previous primary resumes
    if (isPrimary) {
        db.run(
            `UPDATE resumes SET is_primary = 0 WHERE user_id = ?`,
            [req.user.id]
        );
    }

    db.run(
        `INSERT INTO resumes (user_id, resume_name, resume_file, is_primary)
         VALUES (?, ?, ?, ?)`,
        [
            req.user.id,
            resumeName,
            resumeFile,
            isPrimary ? 1 : 0
        ],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Mock parsed data (assignment requirement)
            const parsedData = {
                skills: ["Node.js", "React", "MongoDB"],
                experience: "2 years 6 months",
                education: "B.Tech"
            };

            res.status(201).json({
                success: true,
                message: "Resume uploaded successfully",
                resumeId: this.lastID,
                parsedData
            });
        }
    );
});


module.exports = router;
