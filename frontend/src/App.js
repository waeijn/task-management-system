// === App.js ===
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TaskList from "./components/TaskList";
import TaskEdit from "./components/TaskEdit";
import TaskForm from "./components/TaskForm";
import TaskView from "./components/TaskView";
import "./index.css"; 

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div>
            <h2>Task Manager</h2>
            <nav>
              <Link to="/tasks">📋 Task List</Link>
              <Link to="/task/create">➕ Add Task</Link>
            </nav>
          </div>
          <div className="sidebar-footer">
            <p>© 2025 Task System</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/task/create" element={<TaskForm />} />
            <Route path="/task/edit/:taskId" element={<TaskEdit />} />
            <Route path="/task/:taskId" element={<TaskView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
