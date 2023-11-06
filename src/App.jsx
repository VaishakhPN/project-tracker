import React from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import HomePage from './components/HomePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/NavBar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App w-screen h-screen">
        <Navigation />
        <Routes>
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/create-task" element={<TaskForm />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
