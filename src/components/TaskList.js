// === TaskList.js ===

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link to navigate

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from your Laravel API endpoint for tasks
    // Assuming your Laravel API is running on port 8082 as per your example
    fetch('http://localhost:8082/api/tasks')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []); // Empty array means this effect runs once when the component mounts

  if (loading) {
    return <div>Loading tasks...</div>;
  }
  
  if (error) {
    return <div>Error fetching tasks: {error}</div>;
  }

  return (
    <div>
      <h2>Task List</h2>
      <Link to="/add-task">Add New Task</Link>
      
      {/* You can add a class name here for styling, e.g., className="task-table" */}
      <table>
        <thead>
          <tr>
            {/* Updated table headers for the Task model */}
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {/* Loop through tasks and render each task as a table row */}
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.title}</td>
              {/* Description is nullable */}
              <td>{task.description || 'N/A'}</td>
              <td>{task.status}</td>
              {/* due_date is nullable */}
              <td>{task.due_date || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;