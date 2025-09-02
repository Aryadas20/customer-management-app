const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
require('dotenv').config();
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`
            CREATE TABLE IF NOT EXISTS customers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                phone_number TEXT NOT NULL UNIQUE
            )
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS addresses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_id INTEGER NOT NULL,
                address_details TEXT NOT NULL,
                city TEXT NOT NULL,
                state TEXT NOT NULL,
                pin_code TEXT NOT NULL,
                FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
            )
        `);
    }
});

// Customer Routes
app.post('/api/customers', (req, res) => {
    const { first_name, last_name, phone_number } = req.body;
    if (!first_name || !last_name || !phone_number) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    const sql = 'INSERT INTO customers (first_name, last_name, phone_number) VALUES (?, ?, ?)';
    db.run(sql, [first_name, last_name, phone_number], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Customer created successfully', customerId: this.lastID });
    });
});

app.get('/api/customers', (req, res) => {
    const { search, sort_by = 'first_name', order = 'ASC', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    let sql = `SELECT * FROM customers`;
    const params = [];
    if (search) {
        sql += ` WHERE first_name LIKE ? OR last_name LIKE ? OR phone_number LIKE ?`;
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
    }
    sql += ` ORDER BY ${sort_by} ${order} LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    db.all(sql, params, (err, rows) => {
        if (err) return res.status(400).json({ "error": err.message });
        res.json({ "message": "success", "data": rows });
    });
});

app.get('/api/customers/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM customers WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(400).json({ "error": err.message });
        if (!row) return res.status(404).json({ "error": "Customer not found." });
        res.json({ "message": "success", "data": row });
    });
});

app.put('/api/customers/:id', (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, phone_number } = req.body;
    if (!first_name || !last_name || !phone_number) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    db.run('UPDATE customers SET first_name = ?, last_name = ?, phone_number = ? WHERE id = ?',
        [first_name, last_name, phone_number, id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Customer updated successfully', changes: this.changes });
        });
});

app.delete('/api/customers/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM customers WHERE id = ?', id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Customer deleted successfully', changes: this.changes });
    });
});

// Address Routes
app.post('/api/customers/:id/addresses', (req, res) => {
    const { id } = req.params;
    const { address_details, city, state, pin_code } = req.body;
    if (!address_details || !city || !state || !pin_code) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    db.run('INSERT INTO addresses (customer_id, address_details, city, state, pin_code) VALUES (?, ?, ?, ?, ?)',
        [id, address_details, city, state, pin_code], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Address added successfully', addressId: this.lastID });
        });
});

app.get('/api/customers/:id/addresses', (req, res) => {
    const { id } = req.params;
    db.all('SELECT * FROM addresses WHERE customer_id = ?', [id], (err, rows) => {
        if (err) return res.status(400).json({ "error": err.message });
        res.json({ "message": "success", "data": rows });
    });
});

app.put('/api/addresses/:addressId', (req, res) => {
    const { addressId } = req.params;
    const { address_details, city, state, pin_code } = req.body;
    if (!address_details || !city || !state || !pin_code) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    db.run('UPDATE addresses SET address_details = ?, city = ?, state = ?, pin_code = ? WHERE id = ?',
        [address_details, city, state, pin_code, addressId], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Address updated successfully', changes: this.changes });
        });
});

app.delete('/api/addresses/:addressId', (req, res) => {
    const { addressId } = req.params;
    db.run('DELETE FROM addresses WHERE id = ?', addressId, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Address deleted successfully', changes: this.changes });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});