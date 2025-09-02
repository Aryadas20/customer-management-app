import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';

function CustomerListPage() {
  const [customers, setCustomers] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const sort_by = searchParams.get('sort_by') || 'first_name';
  const order = searchParams.get('order') || 'ASC';
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = 10;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/customers', {
          params: { search, sort_by, order, page, limit }
        });
        setCustomers(response.data.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, [search, sort_by, order, page, limit]);

  const handleSearchChange = (e) => {
    setSearchParams({ search: e.target.value });
  };

  const handleSortChange = (e) => {
    setSearchParams({ sort_by: e.target.value });
  };

  const handleOrderChange = () => {
    setSearchParams({ order: order === 'ASC' ? 'DESC' : 'ASC' });
  };

  const handlePagination = (newPage) => {
    setSearchParams({ page: newPage });
  };
  
  const handleDelete = (customerId) => {
    axios.delete(`http://localhost:5000/api/customers/${customerId}`)
      .then(() => {
        setCustomers(prev => prev.filter(c => c.id !== customerId));
      })
      .catch(error => console.error('Failed to delete customer:', error));
  };

  return (
    <div>
      <h1>Customer List</h1>
      <input type="text" value={search} onChange={handleSearchChange} placeholder="Search customers..." />
      <select value={sort_by} onChange={handleSortChange}>
        <option value="first_name">First Name</option>
        <option value="last_name">Last Name</option>
        <option value="phone_number">Phone</option>
      </select>
      <button onClick={handleOrderChange}>Order: {order === 'ASC' ? '⬆️' : '⬇️'}</button>
      <Link to="/customers/new">Add New Customer</Link>
      <ul>
        {customers.map(customer => (
          <li key={customer.id}>
            <Link to={`/customers/${customer.id}`}>
              {customer.first_name} {customer.last_name} ({customer.phone_number})
            </Link>
            <button onClick={() => handleDelete(customer.id)}>Delete</button>
            <Link to={`/customers/edit/${customer.id}`}>Edit</Link>
          </li>
        ))}
      </ul>
      <div>
        <button onClick={() => handlePagination(page - 1)} disabled={page <= 1}>Previous</button>
        <span>Page {page}</span>
        <button onClick={() => handlePagination(page + 1)}>Next</button>
      </div>
    </div>
  );
}

export default CustomerListPage;