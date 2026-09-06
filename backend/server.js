const express = require("express");
const pool = require("./db");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const projectRoutes = require("./routes/projects");
const commentRoutes = require("./routes/comments");
const attachmentRoutes = require("./routes/attachments");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Authentication routes
app.use("/auth", authRoutes);

// Task routes
app.use("/tasks", taskRoutes);

app.use("/projects", projectRoutes);

app.use("/comments", commentRoutes);

app.use("/attachments", attachmentRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("TaskFlow backend is running!");
});

// Test database connection
pool.query("SELECT NOW()", (err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Database connected!");
    }
});

// Start server
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});