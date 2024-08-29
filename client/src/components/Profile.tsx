import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setMessage('');
      setError('');

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const decodedToken: any = jwtDecode(token); // Декодируем токен
        const userId = decodedToken.id; // Получаем ID пользователя из токена
        const userType = decodedToken.type; // Получаем тип пользователя из токена

        const response = await axios.get(`http://localhost:3001/profile/${userId}/${userType}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(response.data);
        setName(response.data.first_name || ''); 
        setEmail(response.data.email || '');
        setType(response.data.type || '');
      } catch (error) {
        console.error('Error fetching user data', error);
        if (axios.isAxiosError(error)) {
          if (error.response) {
            setError('Failed to fetch user data');
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

    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const decodedToken: any = jwtDecode(token); // Декодируем токен
      const userId = decodedToken.id; // Получаем ID пользователя из токена
      const userType = decodedToken.type; // Получаем тип пользователя из токена

      await axios.put(`http://localhost:3001/profile/${userId}/${userType}`, {
        name,
        email,
        type
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError('Failed to update profile');
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
      <h2>Profile</h2>
      <p>You can change your information here</p>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Type (organization or volunteer)"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Update Profile'}</button>
        </form>
      )}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
};

export default Profile;
