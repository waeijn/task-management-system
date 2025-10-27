// === TaskForm.js ===

import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

const TaskForm = () => {
  // State variables for task form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending"); // Default status
  const [due_date, setDueDate] = useState(""); //
  
  const [message, setMessage] = useState(""); // success/error message
  const [saving, setSaving] = useState(false); // saving state

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(""); // Clear old messages

    // Task data to be sent to the API
    const taskData = { title, description, status, due_date };

    // Set due_date to null if it's empty, as it's nullable
    if (taskData.due_date === "") {
      taskData.due_date = null;
    }

    try {
      // POST data to your Laravel API endpoint for tasks
      const response = await fetch("http://localhost:8082/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(taskData), // convert task data to JSON
      });

      const data = await response.json(); // parse the JSON response

      if (!response.ok) {
        // Handle validation errors from Laravel
        if (data.errors) {
          throw new Error(Object.values(data.errors).join(', '));
        } else {
          throw new Error(data.message || "Failed to create task");
        }
      }
      
      // Success! Set message and clear the form.
      setMessage(`Task "${data.title}" (ID: ${data.id}) created successfully!`);
      setTitle("");
      setDescription("");
      setStatus("pending");
      setDueDate("");
      setSaving(false);
      
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {/* Using a select for the status enum */}
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="in-progress">In-Progress</option>
          <option value="completed">Completed</option>
        </select>
        <input
          type="date"
          placeholder="Due Date (optional)"
          value={due_date}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Task"}
        </button>
      </form>
      
      {message && (
        // You can style this paragraph with a class name for success/error
        <p>
          {message}
        </p>
      )}
      <Link to="/tasks">Back to Task List</Link>
    </div>
  );
};

export default TaskForm;