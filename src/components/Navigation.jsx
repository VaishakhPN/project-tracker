import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="p-2 bg-blue-500">
      <Link to="/">Home</Link>
      <Link to="/tasks">Task List</Link>
      <Link to="/create-task">Create Task</Link>
    </nav>
  );
};

export default Navigation;
