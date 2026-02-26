const express = require("express");
const router = express.Router();

const employerController = require("../controllers/employerController");
const authMiddleware = require("../middleware/authMiddleware");

// Search candidates
router.get(
  "/candidates/search",
  authMiddleware,
  employerController.searchCandidates
);

module.exports = router;