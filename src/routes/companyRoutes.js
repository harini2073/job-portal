const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const companyController = require("../controllers/companyController");

// Add review (jobseeker only ideally)
router.post("/:companyId/reviews", auth, companyController.addReview);

// Get company details + ratings
router.get("/:companyId", companyController.getCompanyDetails);

module.exports = router;