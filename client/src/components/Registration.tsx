import React, { useState } from 'react';
import axios from 'axios';

const Registration = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await axios.post('http://localhost:3001/register', { email, name, type });
      setMessage('Registration successful');
    } catch (error) {
      console.error('Registration error', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError('Registration failed: ' + (error.response.data.message || 'Check your details.'));
        } else if (error.request) {
          setError('Network error. Please check your connection.');
        } else {
          setError('An error occurred. Please try again.');
        }
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Registration</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Type (organization or volunteer)" value={type} onChange={(e) => setType(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Register'}</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Registration;

