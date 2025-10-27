import React, { useState, useEffect } from 'react';
import './App.css';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all tasks from Laravel API
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/tasks')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        return response.json();
      })
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Add new task to state
  const handleTaskAdded = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  if (loading) {
    return <div className="App">Loading tasks...</div>;
  }

  if (error) {
    return <div className="App error">Error: {error}</div>;
  }

  return (
    <div className="App">
      <h1>Task Management System</h1>
      <TaskForm onTaskAdded={handleTaskAdded} />
      <TaskList tasks={tasks} />
    </div>
  );
}

export default App;