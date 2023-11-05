import React from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import HomePage from './components/HomePage';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="p-2 bg-blue-500">
          <Link to="/">Home</Link>
          <Link to="/tasks">Task List</Link>
          <Link to="/create-task">Create Task</Link>
        </nav>
        <Routes>
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/create-task" element={<TaskForm />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
