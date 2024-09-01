import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [field, setField] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:3001/help/requests'); 
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching help requests', error);
        setError('Error receiving help requests');
      }
    };

    fetchRequests();


    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('To add a request you need to log in');
        return;
      }

      await axios.post('http://localhost:3001/help/requests', { title, description, location, date, requesterId: 1, field }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTitle('');
      setDescription('');
      setLocation('');
      setDate('');
      setField('');


      const response = await axios.get('http://localhost:3001/help/requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error creating help request', error);
      setError('Error creating help request');
    }
  };

  return (
    <div>
      <h1>Welcome to Home Page</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} /><p></p>
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} /><p></p>
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} /><p></p>
        <input type="datetime-local" placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} /><p></p>
        <input type="text" placeholder="Field" value={field} onChange={(e) => setField(e.target.value)} /><p></p>
        <button 
          type="submit" 
          disabled={!isAuthenticated}
          title={!isAuthenticated ? 'To add a request you need to log in' : ''}
        >
          Add Help Request
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h2>Current Help Requests</h2>
      <ul>
        {requests.map((request) => (
          <li key={request.id}>
            <h3>{request.title}</h3>
            <p>{request.description}</p>
            <p>{request.location}</p>
            <p>{request.date}</p>
            <p>{request.field}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
