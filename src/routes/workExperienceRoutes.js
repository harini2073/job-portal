const express = require("express");
const router = express.Router();
const db = require("../config/database");
const authMiddleware = require("../middleware/authMiddleware");

// ADD WORK EXPERIENCE
router.post("/", authMiddleware, (req, res) => {
    const {
        company,
        designation,
        location,
        start_date,
        end_date,
        currently_working,
        responsibilities
    } = req.body;

    if (!company || !designation || !start_date) {
        return res.status(400).json({
            message: "Company, designation and start_date are required"
        });
    }

    db.run(
        `INSERT INTO work_experience 
        (user_id, company, designation, location, start_date, end_date, currently_working, responsibilities)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            req.user.id,
            company,
            designation,
            location || null,
            start_date,
            end_date || null,
            currently_working ? 1 : 0,
            responsibilities || null
        ],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                message: "Work experience added successfully",
                experienceId: this.lastID
            });
        }
    );
});

// UPDATE WORK EXPERIENCE
router.put("/:id", authMiddleware, (req, res) => {
    const experienceId = req.params.id;

    const {
        company,
        designation,
        location,
        start_date,
        end_date,
        currently_working,
        responsibilities
    } = req.body;

    db.run(
        `UPDATE work_experience SET
            company = ?,
            designation = ?,
            location = ?,
            start_date = ?,
            end_date = ?,
            currently_working = ?,
            responsibilities = ?
         WHERE id = ? AND user_id = ?`,
        [
            company,
            designation,
            location,
            start_date,
            end_date,
            currently_working ? 1 : 0,
            responsibilities,
            experienceId,
            req.user.id
        ],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Experience not found"
                });
            }

            res.json({
                message: "Work experience updated successfully"
            });
        }
    );
});

// DELETE WORK EXPERIENCE
router.delete("/:id", authMiddleware, (req, res) => {
    const experienceId = req.params.id;

    db.run(
        `DELETE FROM work_experience WHERE id = ? AND user_id = ?`,
        [experienceId, req.user.id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Experience not found"
                });
            }

            res.json({
                message: "Work experience deleted successfully"
            });
        }
    );
});

module.exports = router;
