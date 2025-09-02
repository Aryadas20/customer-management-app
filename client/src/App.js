import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CustomerListPage from './pages/CustomerListPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import CustomerFormPage from './pages/CustomerFormPage';
import './style.css';
function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/customers/new">Add Customer</Link>
      </nav>
      <Routes>
        <Route path="/" element={<CustomerListPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="/customers/new" element={<CustomerFormPage />} />
        <Route path="/customers/edit/:id" element={<CustomerFormPage />} />
      </Routes>
    </Router>
  );
}

export default App;