import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('volunteer'); 
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>  {
    e.preventDefault();
    
    const data = { email, password, type, firstName, lastName, city, description, address, phone, name };

    try {
      await axios.post('https://noneed-9x5k.onrender.com/auth/register', data);
      alert('Registration successful');
    } catch (error) {
      console.error('Registration error:', error);
      if (axios.isAxiosError(error)) {
        setError('Registration failed: ' + (error.response?.data?.message || 'Server error'));
      } else {
        setError('Registration failed: Unknown error');
      }
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
      <p></p>
      {/* Conditionally rendered fields based on type */}
      {type === 'volunteer' && (
        <>
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
          />

          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
          />
        </>
      )}

      {type === 'seeker' && (
        <>
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
          />

          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
          />

          <label>City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
          />
          <p></p>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <p></p>
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />

          <label>Phone:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
          />
        </>
      )}

      {type === 'organization' && (
        <>
          <label>Organization Name:</label>
          <input
            type="text"
            value={name}  
            onChange={(e) => setName(e.target.value)}
            placeholder="Organization Name"
            required
          />

          <label>City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
          />

          <label>Phone:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
          />
          <p></p>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
        </>
      )}
      <p></p>
      <button type="submit">Register</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default Register;
