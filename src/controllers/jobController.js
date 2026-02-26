const db = require("../config/database");

/* ============================
   POST JOB (Employer Only)
============================ */
exports.postJob = (req, res) => {

    if (req.user.role !== "employer") {
        return res.status(403).json({
            message: "Only employers can post jobs"
        });
    }

    const {
        title,
        description,
        location,
        salary_min,
        salary_max,
        skills
    } = req.body;

    if (!title || !description) {
        return res.status(400).json({
            message: "Title and description are required"
        });
    }

    db.run(
        `INSERT INTO jobs (employer_id, title, description, location, salary_min, salary_max)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
            req.user.id,
            title,
            description,
            location || null,
            salary_min || null,
            salary_max || null
        ],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const jobId = this.lastID;

            // If skills are provided
            if (skills) {

                const allSkills = [
                    ...(skills.mandatory || []).map(s => ({ name: s, mandatory: 1 })),
                    ...(skills.preferred || []).map(s => ({ name: s, mandatory: 0 }))
                ];

                allSkills.forEach(skill => {

                    // Insert skill if not exists
                    db.run(
                        `INSERT OR IGNORE INTO skills (name) VALUES (?)`,
                        [skill.name]
                    );

                    // Fetch skill id
                    db.get(
                        `SELECT id FROM skills WHERE name = ?`,
                        [skill.name],
                        (err, skillRow) => {
                            if (!skillRow) return;

                            db.run(
                                `INSERT INTO job_skills (job_id, skill_id, is_mandatory)
                                 VALUES (?, ?, ?)`,
                                [jobId, skillRow.id, skill.mandatory]
                            );
                        }
                    );
                });
            }

            res.status(201).json({
                success: true,
                message: "Job posted successfully",
                jobId
            });
        }
    );
};


/* ============================
   GET ALL JOBS
============================ */
exports.getAllJobs = (req, res) => {

    db.all(
        `SELECT * FROM jobs ORDER BY created_at DESC`,
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                success: true,
                jobs: rows
            });
        }
    );
};
/* ============================
   SEARCH JOBS WITH SKILL MATCH
============================ */
exports.searchJobs = (req, res) => {

    const { skill } = req.query;

    if (!skill) {
        return res.status(400).json({
            message: "Skill query parameter required"
        });
    }

    db.all(
        `SELECT jobs.*
         FROM jobs
         JOIN job_skills ON jobs.id = job_skills.job_id
         JOIN skills ON job_skills.skill_id = skills.id
         WHERE skills.name = ?`,
        [skill],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                success: true,
                results: rows
            });
        }
    );
};
/* ============================
   MATCH JOBS FOR LOGGED USER
============================ */
exports.matchJobs = (req, res) => {

    if (req.user.role !== "jobseeker") {
        return res.status(403).json({
            message: "Only jobseekers can view matched jobs"
        });
    }

    const userId = req.user.id;

    // Get user skills
    db.all(
        `SELECT skill_id FROM user_skills WHERE user_id = ?`,
        [userId],
        (err, userSkills) => {
            if (err) return res.status(500).json({ error: err.message });

            const userSkillIds = userSkills.map(s => s.skill_id);

            // Get all jobs with mandatory skills
            db.all(
                `SELECT jobs.id, jobs.title, jobs.description,
                        job_skills.skill_id
                 FROM jobs
                 JOIN job_skills ON jobs.id = job_skills.job_id
                 WHERE job_skills.is_mandatory = 1`,
                [],
                (err, rows) => {
                    if (err) return res.status(500).json({ error: err.message });

                    const jobMap = {};

                    rows.forEach(row => {
                        if (!jobMap[row.id]) {
                            jobMap[row.id] = {
                                id: row.id,
                                title: row.title,
                                description: row.description,
                                totalMandatory: 0,
                                matched: 0
                            };
                        }

                        jobMap[row.id].totalMandatory++;

                        if (userSkillIds.includes(row.skill_id)) {
                            jobMap[row.id].matched++;
                        }
                    });

                    const results = Object.values(jobMap).map(job => {
                        const score = job.totalMandatory === 0
                            ? 0
                            : Math.round((job.matched / job.totalMandatory) * 100);

                        return {
                            id: job.id,
                            title: job.title,
                            description: job.description,
                            matchScore: score
                        };
                    });

                    res.json({
                        success: true,
                        matchedJobs: results
                    });
                }
            );
        }
    );
};