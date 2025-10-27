// === TaskList.js ===

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure bootstrap is imported

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks from API [cite: 120]
  useEffect(() => {
    fetch("http://localhost:8082/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        setError("Failed to fetch tasks. Please try again later.");
        setLoading(false);
      });
  }, []); 

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      fetch(`http://localhost:8082/api/tasks/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            setTasks(tasks.filter((task) => task.id !== id));
          } else {
            alert("Failed to delete task."); 
          }
        })
        .catch((err) => {
            console.error("Error deleting task:", err);
            alert("An error occurred while deleting the task.");
        });
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading tasks...</p>; 
  }

  if (error) {
    return <p className="alert alert-danger text-center mt-5">{error}</p>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Task List</h1>
        <Link to="/add-task" className="btn btn-primary">
          + Add New Task
        </Link>
      </div>

      {tasks.length === 0 ? (
        <p className="text-center">No tasks available.</p> // 
      ) : (
        <table className="table table-striped table-hover shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>
                  <span className={`badge ${
                      task.status === "completed" ? "bg-success"
                    : task.status === "in-progress" ? "bg-warning text-dark"
                    : "bg-secondary"
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td>{task.due_date || "N/A"}</td>
                <td>
                  <Link to={`/task/${task.id}`} className="btn btn-info btn-sm me-2">
                    View
                  </Link>
                  <Link to={`/task/edit/${task.id}`} className="btn btn-success btn-sm me-2">
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaskList;