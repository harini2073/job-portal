const db = require("../config/database");

/* ============================
   ADD SKILL TO USER
============================ */
exports.addSkill = (req, res) => {

    if (req.user.role !== "jobseeker") {
        return res.status(403).json({
            message: "Only jobseekers can add skills"
        });
    }

    const { skill_name, proficiency, experience_years } = req.body;

    if (!skill_name) {
        return res.status(400).json({
            message: "Skill name is required"
        });
    }

    // Step 1: Insert skill into skills table (if not exists)
    db.run(
        `INSERT OR IGNORE INTO skills (name) VALUES (?)`,
        [skill_name],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Step 2: Get skill id
            db.get(
                `SELECT id FROM skills WHERE name = ?`,
                [skill_name],
                (err, skillRow) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    const skillId = skillRow.id;

                    // Step 3: Link skill to user
                    db.run(
                        `INSERT INTO user_skills (user_id, skill_id, proficiency, experience_years)
                         VALUES (?, ?, ?, ?)`,
                        [
                            req.user.id,
                            skillId,
                            proficiency || null,
                            experience_years || null
                        ],
                        function (err) {
                            if (err) {
                                if (err.message.includes("UNIQUE")) {
                                    return res.status(409).json({
                                        message: "Skill already added"
                                    });
                                }
                                return res.status(500).json({ error: err.message });
                            }

                            res.status(201).json({
                                success: true,
                                message: "Skill added successfully"
                            });
                        }
                    );
                }
            );
        }
    );
};


/* ============================
   GET USER SKILLS
============================ */
exports.getUserSkills = (req, res) => {

    db.all(
        `SELECT skills.name, user_skills.proficiency, user_skills.experience_years
         FROM user_skills
         JOIN skills ON user_skills.skill_id = skills.id
         WHERE user_skills.user_id = ?`,
        [req.user.id],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                success: true,
                skills: rows
            });
        }
    );
};


/* ============================
   DELETE USER SKILL
============================ */
exports.deleteSkill = (req, res) => {

    const skillId = req.params.skillId;

    db.run(
        `DELETE FROM user_skills WHERE user_id = ? AND skill_id = ?`,
        [req.user.id, skillId],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Skill not found"
                });
            }

            res.json({
                success: true,
                message: "Skill removed successfully"
            });
        }
    );
};