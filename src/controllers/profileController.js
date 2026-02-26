const db = require("../config/database");

/* ============================
   GET PROFILE
============================ */
exports.getProfile = (req, res) => {
    const userId = req.user.id;

    db.get(
        `SELECT * FROM job_seeker_profiles WHERE user_id = ?`,
        [userId],
        (err, profile) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (!profile) {
                return res.status(404).json({
                    message: "Profile not found"
                });
            }

            res.status(200).json({
                success: true,
                profile
            });
        }
    );
};


/* ============================
   UPDATE PROFILE
============================ */
exports.updateProfile = (req, res) => {
    const userId = req.user.id;

    const {
        profile_headline,
        current_location,
        preferred_locations,
        current_salary,
        expected_salary,
        notice_period
    } = req.body;

    db.run(
        `UPDATE job_seeker_profiles
         SET profile_headline = ?,
             current_location = ?,
             preferred_locations = ?,
             current_salary = ?,
             expected_salary = ?,
             notice_period = ?
         WHERE user_id = ?`,
        [
            profile_headline,
            current_location,
            preferred_locations,
            current_salary,
            expected_salary,
            notice_period,
            userId
        ],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(200).json({
                success: true,
                message: "Profile updated successfully"
            });
        }
    );
};