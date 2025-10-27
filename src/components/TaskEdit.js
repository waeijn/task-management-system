// === TaskEdit.js ===

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const TaskEdit = () => {
  // Get the taskId from the URL [cite: 146]
  const { taskId } = useParams();
  // Get the navigate function to redirect [cite: 131]
  const navigate = useNavigate();

  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "pending",
    due_date: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // 1. Fetch the existing task data when the component loads
  useEffect(() => {
    fetch(`http://localhost:8082/api/tasks/${taskId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch task details.");
        return res.json();
      })
      .then((data) => {
        // Format the date for the <input type="date">
        if (data.due_date) {
          data.due_date = data.due_date.split('T')[0];
        }
        setTask(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching task:", err);
        setMessage(`Error: ${err.message}`);
        setLoading(false);
      });
  }, [taskId]); // Re-run this effect if the taskId changes

  // 2. Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prevTask => ({
      ...prevTask,
      [name]: value,
    }));
  };

  // 3. Handle form submission to UPDATE the task
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    // Make sure due_date is null if empty, not an empty string
    const taskData = {
        ...task,
        due_date: task.due_date || null
    };

    try {
      const response = await fetch(`http://localhost:8082/api/tasks/${taskId}`, {
        method: "PUT", // Use PUT for updates [cite: 161]
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update task."); // [cite: 162]
      }

      setMessage("Task updated successfully!");
      setSaving(false);
      
      // Redirect back to the task list after a short delay [cite: 137]
      setTimeout(() => navigate("/tasks"), 1000);

    } catch (error) {
      console.error("Update error:", error);
      setMessage(`Error: ${error.message}`);
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading task data...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Edit Task</h2>
      {message && (
        <div
          className={`alert ${
            message.includes("successfully") ? "alert-success" : "alert-danger"
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
            name="title" 
            className="form-control"
            value={task.title}
            onChange={handleChange} 
            required
          />
        </div>

        <div className="mb-3">
          <label>Description</label>
          <textarea
            name="description" 
            className="form-control"
            value={task.description || ""} 
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Status</label>
          <select
            name="status" 
            className="form-select"
            value={task.status}
            onChange={handleChange}
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
            name="due_date" 
            className="form-control"
            value={task.due_date || []} 
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={saving}>
          {saving ? "Updating..." : "Update Task"}
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

export default TaskEdit;