import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 

interface FormData {
  [key: string]: string | undefined;
}

interface User {
  id: number;
  type: string;
  [key: string]: any;
}

interface Field {
  name: string;
  placeholder: string;
  type: 'text' | 'email' | 'date' | 'textarea';
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  
  const getFieldsForUserType = (type: string): Field[] => {
    switch (type) {
      case 'volunteer':
        return [
          { name: 'birthday', placeholder: 'Enter your birthday', type: 'date' },
          { name: 'phone', placeholder: 'Enter your phone', type: 'text' },
          { name: 'city', placeholder: 'Enter your city', type: 'text' },
          { name: 'fields', placeholder: 'Enter fields of interest', type: 'textarea' },
          { name: 'skills', placeholder: 'Enter your skills', type: 'textarea' },
          { name: 'experience', placeholder: 'Enter your experience', type: 'textarea' },
        ];
      case 'organization':
        return [
          { name: 'name', placeholder: 'Enter organization name', type: 'text' },
          { name: 'city', placeholder: 'Enter your city', type: 'text' },
          { name: 'phone', placeholder: 'Enter your phone', type: 'text' },
          { name: 'description', placeholder: 'Enter description', type: 'textarea' },
          { name: 'address', placeholder: 'Enter address', type: 'text' },
        ];
      case 'seeker':
        return [
          { name: 'first_name', placeholder: 'Enter your first name', type: 'text' },
          { name: 'last_name', placeholder: 'Enter your last name', type: 'text' },
          { name: 'city', placeholder: 'Enter your city', type: 'text' },
          { name: 'description', placeholder: 'Enter description', type: 'textarea' },
          { name: 'phone', placeholder: 'Enter your phone', type: 'text' },
          { name: 'website', placeholder: 'Enter your website', type: 'text' },
        ];
      default:
        return [];
    }
  };

  
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setMessage('');
      setError('');
      setEmailError('');

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.id;
        const userType = decodedToken.type;

        const response = await axios.get(`http://localhost:3001/profile/${userId}/${userType}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Server response:', response.data);

        setUser(response.data);
        setFormData(response.data);
      } catch (error: any) {
        console.error('Error fetching user data', error.response ? error.response.data : error.message);
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const validateEmail = async (email: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`http://localhost:3001/validate-email/${encodeURIComponent(email)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return response.data.exists;
    } catch (error: any) {
      console.error('Error validating email', error.response ? error.response.data : error.message);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    setEmailError('');

    try {
      if (formData.email) {
        const emailExists = await validateEmail(formData.email);
        if (emailExists) {
          setEmailError('Email is already in use by another user.');
          setLoading(false);
          return;
        }
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.id;
      const userType = decodedToken.type;

      await axios.put(`http://localhost:3001/profile/${userId}/${userType}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile', error.response ? error.response.data : error.message);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = () => {
    if (!user) return null;

    const fields = getFieldsForUserType(user.type);

    console.log('Rendering fields for user type:', user.type);
    console.log('Fields:', fields);

    return (
      <table>
        <tbody>
          {fields.map(field => (
            <tr key={field.name}>
              <td>{field.placeholder}:</td>
              <td>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h2>Profile</h2>
      {user && (
        <p>
          Hello, {user.type === 'organization' ? user.name : `${user.first_name} ${user.last_name}`}
        </p>
      )}
      <p>You can change your information here</p>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
      <form onSubmit={handleSubmit}>
        {renderFormFields()}
        <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Update Profile'}</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
};

export default Profile;
