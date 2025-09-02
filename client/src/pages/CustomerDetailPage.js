import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function CustomerDetailPage() {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({ address_details: '', city: '', state: '', pin_code: '' });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchCustomerAndAddresses();
    }, [id]);

    const fetchCustomerAndAddresses = async () => {
        try {
            const customerResponse = await axios.get(`http://localhost:5000/api/customers/${id}`);
            setCustomer(customerResponse.data.data);
            const addressesResponse = await axios.get(`http://localhost:5000/api/customers/${id}/addresses`);
            setAddresses(addressesResponse.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddress(prev => ({ ...prev, [name]: value }));
    };

    const validateAddress = () => {
      const newErrors = {};
      if (!newAddress.address_details) newErrors.address_details = 'Address is required.';
      if (!newAddress.city) newErrors.city = 'City is required.';
      if (!newAddress.state) newErrors.state = 'State is required.';
      if (!newAddress.pin_code) newErrors.pin_code = 'Pin code is required.';
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        if (!validateAddress()) return;
        try {
            await axios.post(`http://localhost:5000/api/customers/${id}/addresses`, newAddress);
            setNewAddress({ address_details: '', city: '', state: '', pin_code: '' });
            fetchCustomerAndAddresses();
        } catch (error) {
            console.error('Failed to add address:', error);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        try {
            await axios.delete(`http://localhost:5000/api/addresses/${addressId}`);
            fetchCustomerAndAddresses();
        } catch (error) {
            console.error('Failed to delete address:', error);
        }
    };

    if (!customer) return <div>Loading...</div>;

    return (
        <div>
            <h1>Customer Details</h1>
            <p><strong>Name:</strong> {customer.first_name} {customer.last_name}</p>
            <p><strong>Phone:</strong> {customer.phone_number}</p>

            <h2>Addresses</h2>
            <ul>
                {addresses.map(address => (
                    <li key={address.id}>
                        {address.address_details}, {address.city}, {address.state} - {address.pin_code}
                        <button onClick={() => handleDeleteAddress(address.id)}>Delete</button>
                    </li>
                ))}
            </ul>

            <h3>Add New Address</h3>
            <form onSubmit={handleAddAddress}>
              {errors.api && <div style={{ color: 'red' }}>{errors.api}</div>}
              <input type="text" name="address_details" value={newAddress.address_details} onChange={handleAddressChange} placeholder="Address Details" />
              {errors.address_details && <p style={{ color: 'red' }}>{errors.address_details}</p>}
              <input type="text" name="city" value={newAddress.city} onChange={handleAddressChange} placeholder="City" />
              {errors.city && <p style={{ color: 'red' }}>{errors.city}</p>}
              <input type="text" name="state" value={newAddress.state} onChange={handleAddressChange} placeholder="State" />
              {errors.state && <p style={{ color: 'red' }}>{errors.state}</p>}
              <input type="text" name="pin_code" value={newAddress.pin_code} onChange={handleAddressChange} placeholder="Pin Code" />
              {errors.pin_code && <p style={{ color: 'red' }}>{errors.pin_code}</p>}
              <button type="submit">Add Address</button>
            </form>
        </div>
    );
}

export default CustomerDetailPage;