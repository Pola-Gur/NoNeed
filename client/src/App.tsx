import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import Profile from './components/Profile';
import Events from './components/Events';
import Registration from './components/Registration';
import { useAuth } from './context/AuthContext'; // Импортируйте useAuth
import '../src/App.css';

const App = () => {
  return (
    <Router>
      <NavBar />
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

const NavBar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth(); // Используйте контекст для авторизации

  const handleLogout = () => {
    logout(); // Вызывайте метод logout из контекста
    navigate('/login');
  };

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/events">Events</Link>
      {isAuthenticated ? (
        <>
          <Link to="/profile">Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default App;
