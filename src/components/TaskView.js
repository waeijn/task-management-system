// === TaskView.js ===
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function TaskView() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8082/api/tasks/${taskId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch task details");
        return res.json();
      })
      .then(setTask)
      .catch((err) => setError(err.message));
  }, [taskId]);

  if (error)
    return <div className="alert alert-danger mt-5 text-center">{error}</div>;

  if (!task)
    return <div className="text-center mt-5">Loading task details...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Task Details</h2>
      <div className="card shadow-sm p-4">
        <h4>{task.title}</h4>
        <p><strong>Description:</strong> {task.description || "N/A"}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`badge bg-${
              task.status === "completed"
                ? "success"
                : task.status === "in-progress"
                ? "warning"
                : "secondary"
            }`}
          >
            {task.status}
          </span>
        </p>
        <p><strong>Due Date:</strong> {task.due_date || "N/A"}</p>
      </div>

      <div className="mt-4 text-center">
        <Link to={`/task/edit/${task.id}`} className="btn btn-primary me-2">
          Edit
        </Link>
        <Link to="/tasks" className="btn btn-secondary">
          Back
        </Link>
      </div>
    </div>
  );
}

export default TaskView;
