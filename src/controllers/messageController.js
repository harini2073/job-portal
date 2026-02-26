const db = require("../config/database");

// Send Message
exports.sendMessage = (req, res) => {
    const senderId = req.user.id;
    const { recipientId, subject, message, jobId } = req.body;

    if (!recipientId || !message) {
        return res.status(400).json({
            message: "Recipient and message are required"
        });
    }

    db.run(
        `INSERT INTO messages (sender_id, receiver_id, subject, message, job_id)
         VALUES (?, ?, ?, ?, ?)`,
        [senderId, recipientId, subject || null, message, jobId || null],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                success: true,
                message: "Message sent successfully",
                messageId: this.lastID
            });
        }
    );
};

// Get My Messages
exports.getMyMessages = (req, res) => {
    const userId = req.user.id;

    db.all(
        `SELECT * FROM messages
         WHERE sender_id = ? OR receiver_id = ?
         ORDER BY created_at DESC`,
        [userId, userId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(200).json({
                success: true,
                messages: rows
            });
        }
    );
};

// Get Conversation Between Two Users
exports.getConversation = (req, res) => {
    const userId = req.user.id;
    const otherUserId = req.params.userId;

    db.all(
        `SELECT * FROM messages
         WHERE (sender_id = ? AND receiver_id = ?)
            OR (sender_id = ? AND receiver_id = ?)
         ORDER BY created_at ASC`,
        [userId, otherUserId, otherUserId, userId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(200).json({
                success: true,
                conversation: rows
            });
        }
    );
};