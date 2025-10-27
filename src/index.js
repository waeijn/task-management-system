import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import TaskView from "./components/TaskView";
import TaskEdit from "./components/TaskEdit";

import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/add-task" element={<TaskForm />} />
        <Route path="/task/:taskId" element={<TaskView />} />
        <Route path="/task/edit/:taskId" element={<TaskEdit />} />
      </Routes>
    </Router>
  </React.StrictMode>
);