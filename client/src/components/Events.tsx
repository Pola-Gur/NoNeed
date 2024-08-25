import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Events = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events', error);
        setError('Ошибка при получении событий');
      }
    };

    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/events', { title, description, date }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTitle('');
      setDescription('');
      setDate('');
      const response = await axios.get('http://localhost:3001/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error creating event', error);
      setError('Ошибка при создании события');
    }
  };

  return (
    <div>
      <h1>Events</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="datetime-local" placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button type="submit">Add Event</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h2>Current Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>{event.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Events;
