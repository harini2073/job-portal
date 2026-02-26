const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const skillsController = require("../controllers/skillsController");

// Add skill
router.post("/", authMiddleware, skillsController.addSkill);

// Get my skills
router.get("/", authMiddleware, skillsController.getUserSkills);

// Delete skill
router.delete("/:skillId", authMiddleware, skillsController.deleteSkill);

module.exports = router;