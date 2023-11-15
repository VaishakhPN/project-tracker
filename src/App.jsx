import React from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/NavBar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App w-screen h-screen">
        <Navigation />
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/create-task" element={<TaskForm />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
