// === index.js ===

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your new task components
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
// import TaskEdit from './TaskEdit'; // For Task 5
// import TaskView from './TaskView'; // Optional

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Route to display the list of all tasks */}
        <Route path="/tasks" element={<TaskList />} />
        
        {/* Route to the form for adding a new task */}
        <Route path="/add-task" element={<TaskForm />} />

        {/* <Route path="/task/:taskId" element={<TaskView />} /> */}
        {/* <Route path="/task/edit/:taskId" element={<TaskEdit />} /> */}
      </Routes>
    </Router>
  </React.StrictMode>
);