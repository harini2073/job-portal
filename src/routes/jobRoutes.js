const express = require("express");
const router = express.Router();


const authMiddleware = require("../middleware/authMiddleware");
const jobController = require("../controllers/jobController");

router.post("/", authMiddleware, jobController.postJob);
router.get("/", jobController.getAllJobs);
router.get("/search", jobController.searchJobs);
router.get("/match", authMiddleware, jobController.matchJobs);

module.exports = router;