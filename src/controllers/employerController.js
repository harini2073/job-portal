const db = require("../config/database");

/* ============================
   SEARCH CANDIDATES BY SKILL
============================ */
exports.searchCandidates = (req, res) => {

    if (req.user.role !== "employer") {
        return res.status(403).json({
            message: "Only employers can search candidates"
        });
    }

    const { skill } = req.query;

    if (!skill) {
        return res.status(400).json({
            message: "Skill query parameter is required"
        });
    }

    db.all(
        `SELECT users.id, users.name, users.email
         FROM users
         JOIN user_skills ON users.id = user_skills.user_id
         JOIN skills ON user_skills.skill_id = skills.id
         WHERE users.role = 'jobseeker' AND skills.name = ?`,
        [skill],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                success: true,
                candidates: rows
            });
        }
    );
};