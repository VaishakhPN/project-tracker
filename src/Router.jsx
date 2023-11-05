import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProjectManagementApp from './components/ProjectManagementApp';
import HomePage from './components/HomePage';
import TaskForm from './components/TaskForm';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/tasks' element={<ProjectManagementApp />} />
        <Route path="/tasks" element={<TaskForm />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
