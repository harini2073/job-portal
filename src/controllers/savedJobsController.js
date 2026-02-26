const db = require("../config/database");

/* ============================
   SAVE JOB
============================ */
exports.saveJob = (req, res) => {

    if (req.user.role !== "jobseeker") {
        return res.status(403).json({
            message: "Only jobseekers can save jobs"
        });
    }

    const jobId = req.params.jobId;

    db.run(
        `INSERT INTO saved_jobs (user_id, job_id)
         VALUES (?, ?)`,
        [req.user.id, jobId],
        function (err) {
            if (err) {
                if (err.message.includes("UNIQUE")) {
                    return res.status(409).json({
                        message: "Job already saved"
                    });
                }
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                success: true,
                message: "Job saved successfully"
            });
        }
    );
};


/* ============================
   GET SAVED JOBS
============================ */
exports.getSavedJobs = (req, res) => {

    if (req.user.role !== "jobseeker") {
        return res.status(403).json({
            message: "Only jobseekers can view saved jobs"
        });
    }

    db.all(
        `SELECT jobs.*
         FROM saved_jobs
         JOIN jobs ON saved_jobs.job_id = jobs.id
         WHERE saved_jobs.user_id = ?`,
        [req.user.id],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                success: true,
                savedJobs: rows
            });
        }
    );
};


/* ============================
   DELETE SAVED JOB
============================ */
exports.deleteSavedJob = (req, res) => {

    if (req.user.role !== "jobseeker") {
        return res.status(403).json({
            message: "Only jobseekers can remove saved jobs"
        });
    }

    const jobId = req.params.jobId;

    db.run(
        `DELETE FROM saved_jobs
         WHERE user_id = ? AND job_id = ?`,
        [req.user.id, jobId],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Saved job not found"
                });
            }

            res.json({
                success: true,
                message: "Saved job removed successfully"
            });
        }
    );
};