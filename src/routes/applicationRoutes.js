const express = require("express");
const router = express.Router();

const applicationController = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware");

// Apply to job
router.post(
  "/:jobId/apply",
  authMiddleware,
  applicationController.applyJob
);

// Employer view applications
router.get(
  "/job/:jobId",
  authMiddleware,
  applicationController.viewApplications
);
router.put(
  "/:applicationId/status",
  authMiddleware,
  applicationController.updateApplicationStatus
);

module.exports = router;