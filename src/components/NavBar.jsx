import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const linkStyle = "text-lg";

  return (
    <nav className="p-4 bg-blue-500 flex items-center gap-10">
      <Link to="/" className={linkStyle}>Home</Link>
      <span className="border-r h-6" />
      <Link to="/create-task" className={linkStyle}>Create Task</Link>
      <span className="border-r h-6" />
      <Link to="/tasks" className={linkStyle}>Task List</Link>
    </nav>
  );
};

export default Navigation;
