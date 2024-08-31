import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import Profile from './components/Profile';
import Events from './components/Events';
import Registration from './components/Registration';
import Navbar from './components/Navbar'; // Убедитесь, что импорт правильный
import { useAuth } from './context/AuthContext';
import '../src/App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/events" element={<Events />} />
        <Route path="/register" element={<Registration />} />
      </Routes>
    </Router>
  );
};

export default App;
