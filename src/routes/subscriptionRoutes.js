const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");

// GET all subscription plans
router.get("/plans", subscriptionController.getPlans);

module.exports = router;