// === App.js ===
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import TaskList from "./components/TaskList";
import TaskEdit from "./components/TaskEdit";
import TaskForm from "./components/TaskForm";
import TaskView from "./components/TaskView";
import Settings from "./components/Settings";
import Profile from "./components/Profile";
import { IconInbox, IconCalendar, IconAlert, IconSettings, IconUser } from "./components/Icons";
import "./App.css";

const API_BASE = "http://localhost:8082/api";

function Sidebar({ summary, onRefresh }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentView = searchParams.get("view") || "";
  const currentCategory = searchParams.get("category") || "";
  const isTaskList = location.pathname === "/tasks";

  const handleFilter = (params) => {
    const query = new URLSearchParams(params).toString();
    navigate(`/tasks${query ? `?${query}` : ""}`);
  };

  const isActiveView = (view) => {
    if (!isTaskList) return false;
    return currentView === view && !currentCategory;
  };

  const isActiveCategory = (cat) => {
    if (!isTaskList) return false;
    return currentCategory === cat;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <h2>Tasks</h2>

        <div className="sidebar-section">
          <div className="sidebar-section-title">Views</div>
          <button
            className={`sidebar-filter ${isActiveView("") ? "active" : ""}`}
            onClick={() => handleFilter({})}
          >
            <div className="sidebar-filter-label">
              <IconInbox />
              <span>All Tasks</span>
            </div>
            <span className="sidebar-count">{summary.total || 0}</span>
          </button>
          
          <button
            className={`sidebar-filter ${isActiveView("due_today") ? "active" : ""}`}
            onClick={() => handleFilter({ view: "due_today" })}
          >
            <div className="sidebar-filter-label">
              <IconCalendar />
              <span>Due Today</span>
            </div>
            <span className="sidebar-count">{summary.due_today || 0}</span>
          </button>
          
          <button
            className={`sidebar-filter ${isActiveView("overdue") ? "active" : ""}`}
            onClick={() => handleFilter({ view: "overdue" })}
          >
            <div className="sidebar-filter-label">
              <IconAlert />
              <span>Overdue</span>
            </div>
            <span className={`sidebar-count ${(summary.overdue || 0) > 0 ? "danger" : ""}`}>
              {summary.overdue || 0}
            </span>
          </button>
        </div>

        {summary.categories && Object.keys(summary.categories).length > 0 && (
          <div className="sidebar-section">
            <div className="sidebar-section-title">Categories</div>
            {Object.entries(summary.categories).map(([cat, count]) => (
              <button
                key={cat}
                className={`sidebar-filter ${isActiveCategory(cat) ? "active" : ""}`}
                onClick={() => handleFilter({ category: cat })}
              >
                <div className="sidebar-filter-label">
                  <span className={`category-dot ${cat.toLowerCase()}`}></span>
                  <span>{cat}</span>
                </div>
                <span className="sidebar-count">{count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-section">
          <button className={`sidebar-filter ${location.pathname === "/settings" ? "active" : ""}`} onClick={() => navigate('/settings')}>
            <div className="sidebar-filter-label">
              <IconSettings />
              <span>Settings</span>
            </div>
          </button>
          <button className={`sidebar-filter ${location.pathname === "/profile" ? "active" : ""}`} onClick={() => navigate('/profile')}>
            <div className="sidebar-filter-label">
              <IconUser />
              <span>Profile</span>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}

function AppContent() {
  const [summary, setSummary] = useState({});

  const fetchSummary = useCallback(() => {
    fetch(`${API_BASE}/tasks/summary`)
      .then((res) => res.json())
      .then(setSummary)
      .catch((err) => console.error("Error fetching summary:", err));
  }, []);

  useEffect(() => {
    fetchSummary();

    // Initialize theme
    const savedTheme = localStorage.getItem("app-theme") || "system";
    if (savedTheme === "dark") {
      document.body.classList.add("dark-theme");
    } else if (savedTheme === "system" && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [fetchSummary]);

  return (
    <div className="app-container">
      <Sidebar summary={summary} onRefresh={fetchSummary} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/tasks" replace />} />
          <Route path="/tasks" element={<TaskList onTaskChange={fetchSummary} summary={summary} />} />
          <Route path="/task/create" element={<TaskForm onTaskChange={fetchSummary} />} />
          <Route path="/task/edit/:taskId" element={<TaskEdit onTaskChange={fetchSummary} />} />
          <Route path="/task/:taskId" element={<TaskView onTaskChange={fetchSummary} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  );
}

export default App;
