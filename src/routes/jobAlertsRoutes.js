const express = require("express");
const router = express.Router();
const db = require("../config/database");
const authMiddleware = require("../middleware/authMiddleware");

/* =========================================
   CREATE JOB ALERT
   POST /api/job-alerts
========================================= */
router.post("/", authMiddleware, (req, res) => {

    if (req.user.role !== "jobseeker") {
        return res.status(403).json({
            message: "Only jobseekers can create job alerts"
        });
    }

    const { name, keywords, location, experience, frequency } = req.body;

    if (!name || !frequency) {
        return res.status(400).json({
            message: "Alert name and frequency are required"
        });
    }

    db.run(
        `INSERT INTO job_alerts (user_id, name, keywords, location, experience, frequency)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
            req.user.id,
            name,
            keywords || null,
            location || null,
            experience || null,
            frequency
        ],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                success: true,
                message: "Job alert created successfully",
                alertId: this.lastID
            });
        }
    );
});

/* =========================================
   GET MY JOB ALERTS
   GET /api/job-alerts
========================================= */
router.get("/", authMiddleware, (req, res) => {

    if (req.user.role !== "jobseeker") {
        return res.status(403).json({
            message: "Only jobseekers can view job alerts"
        });
    }

    db.all(
        `SELECT * FROM job_alerts WHERE user_id = ?`,
        [req.user.id],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(200).json({
                success: true,
                alerts: rows
            });
        }
    );
});

/* =========================================
   DELETE JOB ALERT
   DELETE /api/job-alerts/:id
========================================= */
router.delete("/:id", authMiddleware, (req, res) => {

    if (req.user.role !== "jobseeker") {
        return res.status(403).json({
            message: "Only jobseekers can delete job alerts"
        });
    }

    const alertId = req.params.id;

    db.run(
        `DELETE FROM job_alerts WHERE id = ? AND user_id = ?`,
        [alertId, req.user.id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(200).json({
                success: true,
                message: "Job alert deleted successfully"
            });
        }
    );
});

module.exports = router;
    