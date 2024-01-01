// Import required modules
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// Create Express app
const app = express();

// Set up middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',  // Specify only the hostname without the port
  user: "root",
  password: "",
  database: "users",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from('admin123'),
  },
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// CRUD operations


// Create a new record
app.post('/api/users', (req, res) => {
  const { username, email } = req.body;
  const sql = 'INSERT INTO users (username, email) VALUES (?, ?)';
  db.query(sql, [username, email], (err, result) => {
    if (err) throw err;
    res.json({ message: 'User created successfully', userId: result.insertId });
  });
});


// Read all records
app.get('/api/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


// Read a single record by ID
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [userId], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
});


// Update a record by ID
app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const { username, email } = req.body;
  const sql = 'UPDATE users SET username = ?, email = ? WHERE id = ?';
  db.query(sql, [username, email, userId], (err) => {
    if (err) throw err;
    res.json({ message: 'User updated successfully' });
  });
});



// Delete a record by ID
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [userId], (err) => {
    if (err) throw err;
    res.json({ message: 'User deleted successfully' });
  });
});



// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
