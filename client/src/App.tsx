import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import Profile from './components/Profile';
import Events from './components/Events';
import Registration from './components/Registration';

const App = () => {
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        {isAuthenticated ? (
          <>
            <Link to="/profile">Profile</Link>
            <Link to="/events">Events</Link>
            <button onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login'; // Перенаправление на страницу входа
            }}>Logout</button>
          </>
        ) : (
          <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
        )}
      </nav>
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
