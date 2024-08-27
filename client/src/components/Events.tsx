import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Events: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('');
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Ошибка при получении событий', error);
        setError('Ошибка при получении событий');
      }
    };

    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/events', { title, description, date, type }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTitle('');
      setDescription('');
      setDate('');
      setType('');
      // Обновление списка событий после добавления нового
      const response = await axios.get('http://localhost:3001/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Ошибка при создании события', error);
      setError('Ошибка при создании события');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="datetime-local" placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Select type</option>
          <option value="fan">Fan</option>
          <option value="networking">Networking</option>
          <option value="training">Training</option>
        </select>
        <button type="submit">Add Event</button>
      </form>

      {error && <p>{error}</p>}

      <div>
        <h2>Events List</h2>
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <ul>
            {events.map(event => (
              <li key={event.id}>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p>{event.date}</p>
                <p>{event.type}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Events;
