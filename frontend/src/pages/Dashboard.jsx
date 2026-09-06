import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";


function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [search, setSearch] = useState("");
    const [filterPriority, setFilterPriority] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");
    const [dueDate, setDueDate] = useState("");

    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);

    const navigate = useNavigate();

    const filteredTasks = tasks
    .filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((task) =>
        filterPriority === "all"
            ? true
            : task.priority === filterPriority
    )
    .filter((task) =>
        filterStatus === "all"
            ? true
            : filterStatus === "completed"
                ? task.completed
                : !task.completed
    );

    useEffect(() => {
    loadProjects();
    loadTasks();
}, [page]);

    const loadProjects = async () => {
        try {
            const res = await API.get("/projects");
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadTasks = async (projectId = null) => {
    try {
        const url = projectId
            ? `/tasks?project_id=${projectId}&page=${page}&limit=5`
            : `/tasks?page=${page}&limit=5`;

        const res = await API.get(url);

        setTasks(res.data.tasks);
        setTotalPages(res.data.totalPages);

    } catch (err) {
        console.error(err);
    }
};

    const createProject = async (e) => {
        e.preventDefault();

        if (!projectName) return;

        await API.post("/projects", {
            name: projectName,
            description: projectDescription
        });

        setProjectName("");
        setProjectDescription("");
        loadProjects();
    };

    const createTask = async (e) => {
        e.preventDefault();

        if (!title) return;

        await API.post("/tasks", {
            title,
            description,
            priority,
            due_date: dueDate || null,
            project_id: selectedProject
        });

        setTitle("");
        setDescription("");
        setPriority("medium");
        setDueDate("");

        loadTasks(selectedProject);
    };

    const toggleTask = async (task) => {
        await API.put(`/tasks/${task.id}`, {
            title: task.title,
            completed: !task.completed
        });

        loadTasks(selectedProject);
    };

    const deleteTask = async (id) => {
        await API.delete(`/tasks/${id}`);
        loadTasks(selectedProject);
    };
    const uploadFile = async (taskId, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
        await API.post(`/attachments/${taskId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        alert("File uploaded successfully");
    } catch (err) {
        console.error(err);
        alert("File upload failed");
    }
};

    const showComments = async (task) => {
    setSelectedTask(task);

    try {
        const commentsRes = await API.get(`/comments/${task.id}`);
        setComments(commentsRes.data);

        const attachmentsRes = await API.get(
            `/attachments/${task.id}`
        );
        setAttachments(attachmentsRes.data);
    } catch (err) {
        console.error(err);
    }
};
    const addComment = async (e) => {
        e.preventDefault();

        if (!comment || !selectedTask) return;

        await API.post(`/comments/${selectedTask.id}`, {
            content: comment
        });

        setComment("");
        showComments(selectedTask);
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="dashboard">
            <header className="navbar">
                <h1>TaskFlow</h1>
                <button onClick={logout}>Logout</button>
            </header>

            <main className="dashboard-content">

                <section className="projects-section">
                    <h2>Projects</h2>

                    <form onSubmit={createProject} className="form-row">
                        <input
                            placeholder="Project name"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                        />

                        <input
                            placeholder="Description"
                            value={projectDescription}
                            onChange={(e) =>
                                setProjectDescription(e.target.value)
                            }
                        />

                        <button type="submit">Create Project</button>
                    </form>

                    <div className="project-list">
                        <button
                            className={!selectedProject ? "active" : ""}
                            onClick={() => {
                                setSelectedProject(null);
                                loadTasks();
                            }}
                        >
                            All Tasks
                        </button>

                        {projects.map((project) => (
                            <button
                                key={project.id}
                                className={
                                    selectedProject === project.id
                                        ? "active"
                                        : ""
                                }
                                onClick={() => {
                                    setSelectedProject(project.id);
                                    loadTasks(project.id);
                                }}
                            >
                                {project.name}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="tasks-section">
                    <h2>
                        {selectedProject
                            ? "Project Tasks"
                            : "All My Tasks"}
                    </h2>
                            <div className="filters">
    <input
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
    />

    <select
        value={filterPriority}
        onChange={(e) => setFilterPriority(e.target.value)}
    >
        <option value="all">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
    </select>

    <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
    >
        <option value="all">All Status</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
    </select>
</div>
                    <form onSubmit={createTask} className="task-form">
                        <input
                            placeholder="Task title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <input
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                        </select>

                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />

                        <button type="submit">Add Task</button>
                    </form>

                    <div className="task-list">
                        {filteredTasks.length === 0 ? (
                            <p>No tasks found.</p>
                        ) : (
                            filteredTasks.map((task) => (
                                <div className="task-card" key={task.id}>
                                    <div>
                                        <h3 className={task.completed ? "done" : ""}>
                                            {task.title}
                                        </h3>

                                        <p>{task.description}</p>

                                        <span className={`priority priority-${task.priority}`}>
    {task.priority.toUpperCase()} PRIORITY
</span>

                                        {task.due_date && (
    <span className="due-date">
        Due:{" "}
        {new Date(task.due_date).toLocaleDateString()}
    </span>
)}
                                    </div>

                                    <div className="task-actions">
                                        <button onClick={() => toggleTask(task)}>
                                            {task.completed
                                                ? "Undo"
                                                : "Complete"}
                                        </button>
                                                <label className="upload-button">
    Attach File
    <input
        type="file"
        hidden
        onChange={(e) =>
            uploadFile(task.id, e.target.files[0])
        }
    />
</label>
                                        <button
                                            onClick={() =>
                                                showComments(task)
                                            }
                                        >
                                            Comments
                                        </button>

                                        <button
                                            onClick={() =>
                                                deleteTask(task.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                        <div className="pagination">
    <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
    >
        Previous
    </button>

    <span>Page {page} of {totalPages}</span>

    <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
    >
        Next
    </button>
</div>
                    </div>
                </section>

                {selectedTask && (
                    <section className="comments-section">
                        <h2>Comments: {selectedTask.title}</h2>
                        <h3>Attachments</h3>

{attachments.length === 0 ? (
    <p>No attachments.</p>
) : (
    attachments.map((file) => (
        <div className="attachment" key={file.id}>
            <a
                href={`http://localhost:5000/${file.filepath.replace(/\\/g, "/")}`}
                target="_blank"
                rel="noreferrer"
            >
                📎 {file.filename}
            </a>
        </div>
    ))
)}
                        {comments.map((item) => (
                            <div className="comment" key={item.id}>
                                <strong>{item.name}</strong>
                                <p>{item.content}</p>
                            </div>
                        ))}

                        <form onSubmit={addComment}>
                            <input
                                placeholder="Write a comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <button type="submit">Comment</button>
                        </form>
                    </section>
                )}

            </main>
        </div>
    );
}

export default Dashboard;