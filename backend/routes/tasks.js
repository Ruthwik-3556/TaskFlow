const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.use(authMiddleware);

// GET all tasks
// GET tasks with pagination
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const result = await pool.query(
            `SELECT * FROM tasks
             ORDER BY id DESC
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const countResult = await pool.query(
            "SELECT COUNT(*) FROM tasks"
        );

        const totalTasks = parseInt(countResult.rows[0].count);

        res.json({
            tasks: result.rows,
            page: page,
            totalPages: Math.ceil(totalTasks / limit),
            totalTasks: totalTasks
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});
// POST - Create a task
router.post("/", async (req, res) => {
    try {
        const { title, description, priority, due_date, project_id } = req.body;
        const userId = req.user.id;

        if (!title) {
            return res.status(400).json({
                error: "Task title is required"
            });
        }

        // Check that the project belongs to the logged-in user
        if (project_id) {
            const project = await pool.query(
                "SELECT id FROM projects WHERE id = $1 AND user_id = $2",
                [project_id, userId]
            );

            if (project.rows.length === 0) {
                return res.status(404).json({
                    error: "Project not found"
                });
            }
        }

        const result = await pool.query(
            `INSERT INTO tasks
             (title, description, priority, due_date, project_id, user_id)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [
                title,
                description || null,
                priority || "medium",
                due_date || null,
                project_id || null,
                userId
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Database error"
        });
    }
});

// PUT - Update a task
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed, priority, due_date, project_id } = req.body;
        const userId = req.user.id;

        const result = await pool.query(
            `UPDATE tasks
             SET title = COALESCE($1, title),
                 description = COALESCE($2, description),
                 completed = COALESCE($3, completed),
                 priority = COALESCE($4, priority),
                 due_date = COALESCE($5, due_date),
                 project_id = COALESCE($6, project_id)
             WHERE id = $7 AND user_id = $8
             RETURNING *`,
            [title, description, completed, priority, due_date, project_id, id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Database error"
        });
    }
});

// DELETE - Delete a task
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await pool.query(
            "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.json({
            message: "Task deleted successfully",
            task: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Database error"
        });
    }
});

module.exports = router;
