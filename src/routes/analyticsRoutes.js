const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const analyticsController = require("../controllers/analyticsController");

// Job Seeker analytics
router.get("/profile-views", auth, analyticsController.getProfileViews);

// Employer analytics
router.get("/employer/job/:jobId", auth, analyticsController.getJobAnalytics);

module.exports = router;