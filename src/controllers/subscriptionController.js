const db = require("../config/database");

exports.getPlans = (req, res) => {
    db.all(
        `SELECT * FROM subscription_plans`,
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const jobSeekerPlans = rows
                .filter(p => p.type === "jobseeker")
                .map(p => ({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    duration: p.duration,
                    features: p.features ? p.features.split(",") : []
                }));

            const employerPlans = rows
                .filter(p => p.type === "employer")
                .map(p => ({
                    id: p.id,
                    name: p.name,
                    credits: p.credits,
                    price: p.price,
                    features: p.features ? p.features.split(",") : []
                }));

            res.status(200).json({
                success: true,
                jobSeekerPlans,
                employerPlans
            });
        }
    );
};