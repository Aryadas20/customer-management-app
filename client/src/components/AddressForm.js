import React, { useState } from 'react';
import './style.css';
function AddressForm({ onSubmit }) {
  const [formData, setFormData] = useState({ address_details: '', city: '', state: '', pin_code: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.address_details) newErrors.address_details = 'Address is required.';
    if (!formData.city) newErrors.city = 'City is required.';
    if (!formData.state) newErrors.state = 'State is required.';
    if (!formData.pin_code) newErrors.pin_code = 'Pin code is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      setFormData({ address_details: '', city: '', state: '', pin_code: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Address</h3>
      {errors.api && <div style={{ color: 'red' }}>{errors.api}</div>}
      <input type="text" name="address_details" value={formData.address_details} onChange={handleChange} placeholder="Address Details" />
      {errors.address_details && <p style={{ color: 'red' }}>{errors.address_details}</p>}
      <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
      {errors.city && <p style={{ color: 'red' }}>{errors.city}</p>}
      <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" />
      {errors.state && <p style={{ color: 'red' }}>{errors.state}</p>}
      <input type="text" name="pin_code" value={formData.pin_code} onChange={handleChange} placeholder="Pin Code" />
      {errors.pin_code && <p style={{ color: 'red' }}>{errors.pin_code}</p>}
      <button type="submit">Add Address</button>
    </form>
  );
}

export default AddressForm;