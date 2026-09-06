const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

// Add comment to a task
router.post("/:taskId", async (req, res) => {
    try {
        const { taskId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        if (!content) {
            return res.status(400).json({
                error: "Comment content is required"
            });
        }

        // Check that the task belongs to the logged-in user
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
            `INSERT INTO comments (content, user_id, task_id)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [content, userId, taskId]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Database error"
        });
    }
});

// Get comments for a task
router.get("/:taskId", async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id;

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
            `SELECT comments.*, users.name
             FROM comments
             JOIN users ON comments.user_id = users.id
             WHERE comments.task_id = $1
             ORDER BY comments.created_at ASC`,
            [taskId]
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