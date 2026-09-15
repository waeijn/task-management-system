// === TaskForm.js ===
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CATEGORIES = ["Work", "Personal", "School", "Health"];
const API_BASE = "http://localhost:8082/api";

const TaskForm = ({ onTaskChange }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [due_date, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("medium");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const taskData = {
      title,
      description,
      status,
      due_date: due_date || null,
      category: category || null,
      priority,
    };

    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create task");

      setMessage("Task created successfully!");
      setSaving(false);
      if (onTaskChange) onTaskChange();

      setTimeout(() => navigate("/tasks"), 800);
    } catch (error) {
      setMessage(`${error.message}`);
      setSaving(false);
    }
  };

  return (
    <div className="fade-in">
      <Link to="/tasks" className="back-link">
        Back to Tasks
      </Link>

      <div className="form-card">
        <h2>Add New Task</h2>

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
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add some details..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                className="form-input"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
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
                className="form-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
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
                className="form-input"
                value={due_date}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary-soft" disabled={saving}>
            {saving ? "Saving..." : "Save Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
