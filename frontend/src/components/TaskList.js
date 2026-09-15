// === TaskList.js ===
import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8082/api";

const getStatusClass = (status) => {
  if (status === "completed") return "completed";
  if (status === "in-progress") return "in-progress";
  return "pending";
};

const TaskList = ({ onTaskChange, summary }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'

  const currentCategory = searchParams.get("category") || "";
  const currentPriority = searchParams.get("priority") || "";

  // Build a title based on active filters
  const getPageTitle = () => {
    const view = searchParams.get("view");
    const status = searchParams.get("status");

    if (view === "due_today") return "Due Today";
    if (view === "overdue") return "Overdue Tasks";
    if (status) return `${status.charAt(0).toUpperCase() + status.slice(1)} Tasks`;
    return "All Tasks";
  };

  useEffect(() => {
    setLoading(true);
    const queryString = searchParams.toString();
    fetch(`${API_BASE}/tasks${queryString ? `?${queryString}` : ""}`)
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
  }, [searchParams]);

  const handleFilterChange = (filterType, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(filterType, value);
    } else {
      newParams.delete(filterType);
    }
    navigate(`/tasks?${newParams.toString()}`);
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this task?")) {
      fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" })
        .then((res) => {
          if (res.ok) {
            setTasks(tasks.filter((task) => task.id !== id));
            if (onTaskChange) onTaskChange();
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

  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks;
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  if (loading) {
    return <div className="loading-state fade-in">Loading tasks...</div>;
  }

  if (error) {
    return <div className="alert-soft error fade-in">{error}</div>;
  }

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: "16px" }}>
        <h1>{getPageTitle()}</h1>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search tasks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "240px", padding: "8px 12px", background: "#fff" }}
          />
          <div className="view-toggle" style={{ display: "flex", gap: "4px", background: "#e8ece9", padding: "4px", borderRadius: "8px" }}>
            <button 
              className={`btn-minimal ${viewMode === 'grid' ? 'active' : ''}`} 
              onClick={() => setViewMode("grid")}
              style={{ border: "none", background: viewMode === "grid" ? "#fff" : "transparent", boxShadow: viewMode === "grid" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}
            >
              Grid
            </button>
            <button 
              className={`btn-minimal ${viewMode === 'list' ? 'active' : ''}`} 
              onClick={() => setViewMode("list")}
              style={{ border: "none", background: viewMode === "list" ? "#fff" : "transparent", boxShadow: viewMode === "list" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}
            >
              List
            </button>
          </div>
          <Link to="/task/create" className="btn-add">
            + New Task
          </Link>
        </div>
      </div>

      <div className="stats-cards-row">
        <div 
          className={`stat-card ${!searchParams.get("status") ? "active" : ""}`}
          onClick={() => handleFilterChange("status", "")}
        >
          <div className="stat-title">Total Tasks</div>
          <div className="stat-value">{summary?.total || 0}</div>
        </div>
        <div 
          className={`stat-card ${searchParams.get("status") === "pending" ? "active" : ""}`}
          onClick={() => handleFilterChange("status", "pending")}
        >
          <div className="stat-title">Pending</div>
          <div className="stat-value pending">{(summary?.status && summary.status["pending"]) || 0}</div>
        </div>
        <div 
          className={`stat-card ${searchParams.get("status") === "in-progress" ? "active" : ""}`}
          onClick={() => handleFilterChange("status", "in-progress")}
        >
          <div className="stat-title">In Progress</div>
          <div className="stat-value in-progress">{(summary?.status && summary.status["in-progress"]) || 0}</div>
        </div>
        <div 
          className={`stat-card ${searchParams.get("status") === "completed" ? "active" : ""}`}
          onClick={() => handleFilterChange("status", "completed")}
        >
          <div className="stat-title">Completed</div>
          <div className="stat-value completed">{(summary?.status && summary.status["completed"]) || 0}</div>
        </div>
      </div>

      <div className="in-page-filters">
        <div className="filter-group">
          <span className="filter-label">Priority:</span>
          <button 
            className={`filter-pill ${!currentPriority ? "active" : ""}`}
            onClick={() => handleFilterChange("priority", "")}
          >
            All
          </button>
          <button 
            className={`filter-pill ${currentPriority === "high" ? "active" : ""}`}
            onClick={() => handleFilterChange("priority", "high")}
          >
            High <span className="filter-pill-count">{summary?.priorities?.high || 0}</span>
          </button>
          <button 
            className={`filter-pill ${currentPriority === "medium" ? "active" : ""}`}
            onClick={() => handleFilterChange("priority", "medium")}
          >
            Medium <span className="filter-pill-count">{summary?.priorities?.medium || 0}</span>
          </button>
          <button 
            className={`filter-pill ${currentPriority === "low" ? "active" : ""}`}
            onClick={() => handleFilterChange("priority", "low")}
          >
            Low <span className="filter-pill-count">{summary?.priorities?.low || 0}</span>
          </button>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks found</p>
          <span>Try a different filter or create a new task</span>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "task-grid" : "task-list-view"}>
          {filteredTasks.map((task) => (
            <Link to={`/task/${task.id}`} key={task.id} className="task-card">
              <div className="task-card-header">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className={`priority-dot ${task.priority || "medium"}`} title={`${task.priority || "medium"} priority`}></span>
                  <h3 className="task-card-title">{task.title}</h3>
                </div>
                <span className={`status-badge ${getStatusClass(task.status)}`}>
                  {task.status}
                </span>
              </div>

              <div className="task-card-footer" style={{ marginTop: "16px" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  {task.category && (
                    <span className={`category-tag ${task.category.toLowerCase()}`}>
                      {task.category}
                    </span>
                  )}
                  <span className="task-card-date">
                    {task.due_date ? `Due: ${task.due_date}` : "No due date"}
                  </span>
                </div>
                <div className="task-card-actions">
                  <Link
                    to={`/task/edit/${task.id}`}
                    className="btn-minimal"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Edit
                  </Link>
                  <button
                    className="btn-minimal danger"
                    onClick={(e) => handleDelete(e, task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;