const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

/* ============================
   JOBSEEKER REGISTER
============================ */
exports.registerJobseeker = async (req, res) => {
    try {
        const { name, email, password, mobile } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
            [name, email, hashedPassword, "jobseeker"],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                const userId = this.lastID;

                db.run(
                    `INSERT INTO job_seeker_profiles (user_id, mobile) VALUES (?, ?)`,
                    [userId, mobile || null]
                );

                const token = jwt.sign(
                    { id: userId, email, role: "jobseeker" },
                    "supersecretkey",
                    { expiresIn: "1h" }
                );

                res.status(201).json({
                    success: true,
                    message: "Registration successful",
                    userId,
                    token
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* ============================
   EMPLOYER REGISTER
============================ */
exports.registerEmployer = async (req, res) => {
    try {
        const {
            companyName,
            email,
            password,
            mobile,
            recruiterName,
            designation,
            companyWebsite
        } = req.body;

        if (!companyName || !email || !password) {
            return res.status(400).json({
                message: "Company name, email and password are required"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
            [recruiterName || companyName, email, hashedPassword, "employer"],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                const userId = this.lastID;

                db.run(
                    `INSERT INTO companies (name, website) VALUES (?, ?)`,
                    [companyName, companyWebsite || null],
                    function (err) {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }

                        const companyId = this.lastID;

                        db.run(
                            `INSERT INTO employers (user_id, company_id, recruiter_name, designation, mobile)
                             VALUES (?, ?, ?, ?, ?)`,
                            [
                                userId,
                                companyId,
                                recruiterName || null,
                                designation || null,
                                mobile || null
                            ]
                        );

                        const token = jwt.sign(
                            { id: userId, email, role: "employer" },
                            "supersecretkey",
                            { expiresIn: "1h" }
                        );

                        res.status(201).json({
                            success: true,
                            message: "Employer registered successfully",
                            userId,
                            token
                        });
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* ============================
   LOGIN
============================ */
exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    db.get(
        `SELECT * FROM users WHERE email = ?`,
        [email],
        async (err, user) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (!user) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                "supersecretkey",
                { expiresIn: "1h" }
            );

            res.status(200).json({
                success: true,
                message: "Login successful",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }
    );
};