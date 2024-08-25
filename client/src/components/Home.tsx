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

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:3001');
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching help requests', error);
        setError('Ошибка при получении запросов о помощи');
      }
    };

    fetchRequests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001', { title, description, location, date, requesterId: 1, field }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTitle('');
      setDescription('');
      setLocation('');
      setDate('');
      setField('');
      // Обновить список запросов
      const response = await axios.get('http://localhost:3001');
      setRequests(response.data);
    } catch (error) {
      console.error('Error creating help request', error);
      setError('Ошибка при создании запроса о помощи');
    }
  };

  return (
    <div>
      <h1>Welcome to Home Page</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <input type="datetime-local" placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="text" placeholder="Field" value={field} onChange={(e) => setField(e.target.value)} />
        <button type="submit">Add Help Request</button>
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

