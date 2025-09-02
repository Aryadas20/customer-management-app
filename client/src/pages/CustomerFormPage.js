import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function CustomerFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ first_name: '', last_name: '', phone_number: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/customers/${id}`)
        .then(response => setFormData(response.data.data))
        .catch(err => console.error('Failed to fetch customer:', err));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = 'First name is required.';
    if (!formData.last_name) newErrors.last_name = 'Last name is required.';
    if (!formData.phone_number) newErrors.phone_number = 'Phone number is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const request = id 
      ? axios.put(`http://localhost:5000/api/customers/${id}`, formData)
      : axios.post('http://localhost:5000/api/customers', formData);
    request
      .then(() => navigate('/'))
      .catch(err => {
        console.error('Submission error:', err);
        setErrors({ api: 'Error submitting form. Please try again.' });
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{id ? 'Edit Customer' : 'Add New Customer'}</h2>
      {errors.api && <div style={{ color: 'red' }}>{errors.api}</div>}
      <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" />
      {errors.first_name && <p style={{ color: 'red' }}>{errors.first_name}</p>}
      <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" />
      {errors.last_name && <p style={{ color: 'red' }}>{errors.last_name}</p>}
      <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone Number" />
      {errors.phone_number && <p style={{ color: 'red' }}>{errors.phone_number}</p>}
      <button type="submit">{id ? 'Update Customer' : 'Add Customer'}</button>
    </form>
  );
}

export default CustomerFormPage;