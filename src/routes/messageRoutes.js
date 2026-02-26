const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const messageController = require("../controllers/messageController");

router.post("/send", auth, messageController.sendMessage);
router.get("/", auth, messageController.getMyMessages);
router.get("/:userId", auth, messageController.getConversation);

module.exports = router;