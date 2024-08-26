import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('volunteer'); // Default type
  const [error, setError] = useState(''); // Для отображения ошибок

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>  {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/auth/register', { email, password, type });
      alert('Registration successful');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        autoComplete="email"
      />

      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        autoComplete="current-password"
      />

      <label>Type:</label>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="volunteer">Volunteer</option>
        <option value="seeker">Seeker</option>
        <option value="organization">Organization</option>
      </select>

      <button type="submit">Register</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default Register;