import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className=" flex flex-col items-center justify-center bg-200 p-56">
      <h1 className="text-4xl font-bold mb-4">Project Management App</h1>
      <p className="text-lg mb-4">Welcome to the project management system homepage.</p>
      <Link to="/tasks">
        <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
          Go to Tasks
        </button>
      </Link>
    </div>
  );
};

export default HomePage;
