const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// Jobseeker Registration
router.post("/jobseeker/register", authController.registerJobseeker);

// Employer Registration
router.post("/employer/register", authController.registerEmployer);

// Login
router.post("/login", authController.login);

module.exports = router;