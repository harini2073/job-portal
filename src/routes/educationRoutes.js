const express = require("express");
const router = express.Router();

const educationController = require("../controllers/educationController");
const authMiddleware = require("../middleware/authMiddleware");

// Add education
router.post("/", authMiddleware, educationController.addEducation);

// Update education
router.put("/:id", authMiddleware, educationController.updateEducation);

// Delete education
router.delete("/:id", authMiddleware, educationController.deleteEducation);

module.exports = router;