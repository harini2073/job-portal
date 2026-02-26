const db = require("../config/database");

exports.addEducation = (req, res) => {

    if (req.user.role !== "jobseeker") {
        return res.status(403).json({
            message: "Only jobseekers can add education"
        });
    }

    const { degree, institution, graduation_year, specialization } = req.body;

    if (!degree || !institution || !graduation_year) {
        return res.status(400).json({
            message: "Degree, institution and graduation_year are required"
        });
    }

    db.run(
        `INSERT INTO education (user_id, degree, institution, graduation_year, specialization)
         VALUES (?, ?, ?, ?, ?)`,
        [
            req.user.id,
            degree,
            institution,
            graduation_year,
            specialization || null
        ],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                message: "Education added successfully",
                educationId: this.lastID
            });
        }
    );
};

/* ============================
   UPDATE EDUCATION
============================ */
exports.updateEducation = (req, res) => {

    if (req.user.role !== "jobseeker") {
        return res.status(403).json({
            message: "Only jobseekers can update education"
        });
    }

    const educationId = req.params.id;
    const { degree, institution, graduation_year, specialization } = req.body;

    db.run(
        `UPDATE education
         SET degree = ?, institution = ?, graduation_year = ?, specialization = ?
         WHERE id = ? AND user_id = ?`,
        [
            degree,
            institution,
            graduation_year,
            specialization,
            educationId,
            req.user.id
        ],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Education not found"
                });
            }

            res.json({
                message: "Education updated successfully"
            });
        }
    );
};

/* ============================
   DELETE EDUCATION
============================ */
exports.deleteEducation = (req, res) => {

    if (req.user.role !== "jobseeker") {
        return res.status(403).json({
            message: "Only jobseekers can delete education"
        });
    }

    const educationId = req.params.id;

    db.run(
        `DELETE FROM education WHERE id = ? AND user_id = ?`,
        [educationId, req.user.id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Education not found"
                });
            }

            res.json({
                message: "Education deleted successfully"
            });
        }
    );
};
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