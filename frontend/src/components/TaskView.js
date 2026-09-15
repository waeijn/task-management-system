// === TaskView.js ===
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_BASE = "http://localhost:8082/api";

const getStatusClass = (status) => {
  if (status === "completed") return "completed";
  if (status === "in-progress") return "in-progress";
  return "pending";
};

function TaskView({ onTaskChange }) {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/tasks/${taskId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch task details");
        return res.json();
      })
      .then(setTask)
      .catch((err) => setError(err.message));
  }, [taskId]);

  if (error) {
    return <div className="alert-soft error fade-in">{error}</div>;
  }

  if (!task) {
    return <div className="loading-state fade-in">Loading task details...</div>;
  }

  return (
    <div className="fade-in">
      <Link to="/tasks" className="back-link">
        Back to Tasks
      </Link>

      <div className="detail-card">
        <div className="detail-header">
          <h2>{task.title}</h2>
          <div className="detail-badges">
            <span className={`status-badge ${getStatusClass(task.status)}`}>
              {task.status}
            </span>
            {task.priority && (
              <span className={`priority-badge ${task.priority}`}>
                {task.priority}
              </span>
            )}
          </div>
        </div>

        {task.category && (
          <div className="detail-field">
            <div className="detail-label">Category</div>
            <div className="detail-value">
              <span className="category-tag" style={{ fontSize: "13px", padding: "4px 10px" }}>
                {task.category}
              </span>
            </div>
          </div>
        )}

        <div className="detail-field">
          <div className="detail-label">Description</div>
          <div className="detail-value">
            {task.description || "No description provided."}
          </div>
        </div>

        <div className="detail-field">
          <div className="detail-label">Due Date</div>
          <div className="detail-value">
            {task.due_date || "No due date set"}
          </div>
        </div>

        <div className="detail-actions">
          <Link
            to={`/task/edit/${task.id}`}
            className="btn-primary-soft"
            style={{ width: "auto", textDecoration: "none" }}
          >
            Edit Task
          </Link>
          <Link to="/tasks" className="btn-minimal" style={{ padding: "11px 22px" }}>
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TaskView;
