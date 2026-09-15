// === TaskEdit.js ===
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const CATEGORIES = ["Work", "Personal", "School", "Health"];
const API_BASE = "http://localhost:8082/api";

const TaskEdit = ({ onTaskChange }) => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "pending",
    due_date: "",
    category: "",
    priority: "medium",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/tasks/${taskId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch task details.");
        return res.json();
      })
      .then((data) => {
        if (data.due_date) {
          data.due_date = data.due_date.split("T")[0];
        }
        setTask(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching task:", err);
        setMessage(`Error: ${err.message}`);
        setLoading(false);
      });
  }, [taskId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const taskData = {
      ...task,
      due_date: task.due_date || null,
      category: task.category || null,
    };

    try {
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update task.");
      }

      setMessage("Task updated successfully!");
      setSaving(false);
      if (onTaskChange) onTaskChange();

      setTimeout(() => navigate("/tasks"), 800);
    } catch (error) {
      console.error("Update error:", error);
      setMessage(`Error: ${error.message}`);
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-state fade-in">Loading task data...</div>;
  }

  return (
    <div className="fade-in">
      <Link to="/tasks" className="back-link">
        Back to Tasks
      </Link>

      <div className="form-card">
        <h2>Edit Task</h2>

        {message && (
          <div className={`alert-soft ${message.includes("successfully") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={task.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              className="form-input"
              value={task.description || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                className="form-input"
                value={task.category || ""}
                onChange={handleChange}
              >
                <option value="">None</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                name="priority"
                className="form-input"
                value={task.priority || "medium"}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                className="form-input"
                value={task.status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                name="due_date"
                className="form-input"
                value={task.due_date || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary-soft" disabled={saving}>
            {saving ? "Updating..." : "Update Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskEdit;