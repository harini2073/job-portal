const db = require("../config/database");


// ➤ Add Company Review (Job Seeker Only)
exports.addReview = (req, res) => {
    const userId = req.user.id;
    const companyId = req.params.companyId;

    const {
        overallRating,
        ratings,
        title,
        pros,
        cons,
        employmentStatus,
        jobTitle,
        yearsWorked,
        recommendToFriend
    } = req.body;

    if (!overallRating) {
        return res.status(400).json({
            message: "Overall rating is required"
        });
    }

    db.run(
        `INSERT INTO company_reviews 
        (company_id, user_id, overall_rating, work_life_balance, compensation, culture, career_growth,
         title, pros, cons, employment_status, job_title, years_worked, recommend)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            companyId,
            userId,
            overallRating,
            ratings?.workLifeBalance || null,
            ratings?.compensation || null,
            ratings?.culture || null,
            ratings?.careerGrowth || null,
            title || null,
            pros || null,
            cons || null,
            employmentStatus || null,
            jobTitle || null,
            yearsWorked || null,
            recommendToFriend ? 1 : 0
        ],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                success: true,
                message: "Review added successfully",
                reviewId: this.lastID
            });
        }
    );
};


// ➤ Get Company Details + Ratings
exports.getCompanyDetails = (req, res) => {
    const companyId = req.params.companyId;

    db.get(
        `SELECT * FROM companies WHERE id = ?`,
        [companyId],
        (err, company) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (!company) {
                return res.status(404).json({
                    message: "Company not found"
                });
            }

            db.all(
                `SELECT * FROM company_reviews WHERE company_id = ?`,
                [companyId],
                (err, reviews) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    const reviewCount = reviews.length;

                    const avg = (field) =>
                        reviewCount
                            ? (
                                  reviews.reduce((sum, r) => sum + (r[field] || 0), 0) /
                                  reviewCount
                              ).toFixed(1)
                            : 0;

                    res.status(200).json({
                        success: true,
                        company: {
                            ...company,
                            rating: {
                                overall: avg("overall_rating"),
                                workLifeBalance: avg("work_life_balance"),
                                compensation: avg("compensation"),
                                culture: avg("culture"),
                                careerGrowth: avg("career_growth")
                            },
                            reviewCount
                        }
                    });
                }
            );
        }
    );
};