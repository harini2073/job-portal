const db = require("../config/database");

/* ===============================
   APPLY FOR A JOB (Jobseeker)
================================ */
exports.applyJob = (req, res) => {

    if (req.user.role !== "jobseeker") {
        return res.status(403).json({
            message: "Only jobseekers can apply"
        });
    }

    const userId = req.user.id;
    const jobId = req.params.jobId;

    // Prevent duplicate application
    db.get(
        `SELECT * FROM applications WHERE user_id = ? AND job_id = ?`,
        [userId, jobId],
        (err, existing) => {
            if (err) return res.status(500).json({ error: err.message });

            if (existing) {
                return res.status(409).json({
                    message: "Already applied for this job"
                });
            }

            db.run(
                `INSERT INTO applications (user_id, job_id, status)
                 VALUES (?, ?, ?)`,
                [userId, jobId, "applied"],
                function (err) {
                    if (err) return res.status(500).json({ error: err.message });

                    res.status(201).json({
                        success: true,
                        message: "Application submitted successfully"
                    });
                }
            );
        }
    );
};


/* ==========================================
   EMPLOYER VIEW APPLICATIONS FOR A JOB
========================================== */
exports.viewApplications = (req, res) => {

    if (req.user.role !== "employer") {
        return res.status(403).json({
            message: "Only employers can view applications"
        });
    }

    const jobId = req.params.jobId;

    db.all(
        `SELECT applications.id,
                applications.status,
                users.name,
                users.email
         FROM applications
         JOIN users ON applications.user_id = users.id
         WHERE applications.job_id = ?`,
        [jobId],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                success: true,
                applications: rows
            });
        }
    );
};
/* ======================================
   UPDATE APPLICATION STATUS (Employer)
====================================== */
exports.updateApplicationStatus = (req, res) => {

    if (req.user.role !== "employer") {
        return res.status(403).json({
            message: "Only employers can update application status"
        });
    }

    const applicationId = req.params.applicationId;
    const { status } = req.body;

    const allowedStatuses = [
        "viewed",
        "shortlisted",
        "rejected",
        "interview_scheduled"
    ];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: "Invalid status value"
        });
    }

    db.run(
        `UPDATE applications
         SET status = ?
         WHERE id = ?`,
        [status, applicationId],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Application not found"
                });
            }

            res.json({
                success: true,
                message: "Application status updated"
            });
        }
    );
};