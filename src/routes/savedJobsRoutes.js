const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const savedJobsController = require("../controllers/savedJobsController");

router.post("/:jobId/save", authMiddleware, savedJobsController.saveJob);
router.get("/", authMiddleware, savedJobsController.getSavedJobs);
router.delete("/:jobId/save", authMiddleware, savedJobsController.deleteSavedJob);

module.exports = router;