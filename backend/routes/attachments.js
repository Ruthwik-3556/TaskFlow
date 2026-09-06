const express = require("express");
const multer = require("multer");
const path = require("path");
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1E9);

        cb(null, uniqueName + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

// Upload file to a task
router.post("/:taskId", upload.single("file"), async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({
                error: "No file uploaded"
            });
        }

        const task = await pool.query(
            "SELECT id FROM tasks WHERE id = $1 AND user_id = $2",
            [taskId, userId]
        );

        if (task.rows.length === 0) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        const result = await pool.query(
            `INSERT INTO attachments
             (filename, filepath, task_id, user_id)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [
                req.file.originalname,
                req.file.path,
                taskId,
                userId
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Upload failed"
        });
    }
});

// Get task attachments
router.get("/:taskId", async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT attachments.*
             FROM attachments
             JOIN tasks ON attachments.task_id = tasks.id
             WHERE attachments.task_id = $1
             AND tasks.user_id = $2
             ORDER BY attachments.uploaded_at DESC`,
            [taskId, userId]
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Database error"
        });
    }
});

module.exports = router;