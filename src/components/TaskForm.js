// === TaskForm.js ===
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const TaskForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [due_date, setDueDate] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const taskData = { title, description, status, due_date: due_date || null };

    try {
      const response = await fetch("http://localhost:8082/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create task");

      setMessage("Task created successfully!");
      setSaving(false);

      setTimeout(() => navigate("/tasks"), 1000);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
      setSaving(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Add New Task</h2>
      {message && (
        <div
          className={`alert ${
            message.startsWith("✅") ? "alert-success" : "alert-danger"
          }`}
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Status</label>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In-Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Due Date</label>
          <input
            type="date"
            className="form-control"
            value={due_date}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={saving}>
          {saving ? "Saving..." : "Save Task"}
        </button>
      </form>

      <div className="text-center mt-3">
        <Link to="/tasks" className="btn btn-link">
          ← Back to Task List
        </Link>
      </div>
    </div>
  );
};

export default TaskForm;
