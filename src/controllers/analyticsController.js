const db = require("../config/database");

// 🔹 Job Seeker – Profile Views
exports.getProfileViews = (req, res) => {
    const userId = req.user.id;

    db.all(
        `SELECT * FROM profile_views WHERE viewed_user_id = ?`,
        [userId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const totalViews = rows.length;

            res.status(200).json({
                success: true,
                analytics: {
                    totalViews,
                    viewsThisWeek: totalViews,
                    viewsThisMonth: totalViews,
                    viewerCompanies: [],
                    searchAppearances: totalViews * 3
                }
            });
        }
    );
};


// 🔹 Employer – Job Analytics
exports.getJobAnalytics = (req, res) => {
    const jobId = req.params.jobId;

    db.all(
        `SELECT * FROM job_views WHERE job_id = ?`,
        [jobId],
        (err, views) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            db.all(
                `SELECT * FROM applications WHERE job_id = ?`,
                [jobId],
                (err, applications) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    const totalViews = views.length;
                    const totalApplications = applications.length;
                    const shortlisted = applications.filter(
                        a => a.status === "shortlisted"
                    ).length;

                    const conversionRate = totalViews
                        ? ((totalApplications / totalViews) * 100).toFixed(1) + "%"
                        : "0%";

                    res.status(200).json({
                        success: true,
                        analytics: {
                            views: totalViews,
                            applications: totalApplications,
                            shortlisted,
                            conversionRate
                        }
                    });
                }
            );
        }
    );
};