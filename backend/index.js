require("dotenv").config(); // Load environment variables

const express = require("express");
const bodyParser = require("body-parser"); // Parse client data
const cors = require("cors"); // Enable frontend-backend interaction
const { Pool } = require("pg");

const app = express();
const port = process.env.SERVER_PORT || 5000; // Use environment variable for port

// Middleware
app.use(bodyParser.json());
app.use(cors());

// PostgreSQL Pool Configuration using environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use DATABASE_URL in production
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false, // Enable SSL for production
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log('Database connected:', result.rows);
  });
});

// Routes

// Fetch all Employees
app.get("/api/employees", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employees ORDER BY id");
    res.send(result.rows);
  } catch (error) {
    console.error("Error fetching employees", error);
    res.status(500).send({ message: "Error fetching employees" });
  }
});

// Add Employee
app.post("/api/employees", async (req, res) => {
  const { first_name, last_name, employee_id, email, phone_number, department, date_of_joining, role } = req.body;

  const fullName = `${first_name} ${last_name}`; // Combine first and last name

  try {
    const query = `
      INSERT INTO employees (name, employee_id, email, phone_number, department, date_of_joining, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;
    const result = await pool.query(query, [fullName, employee_id, email, phone_number, department, date_of_joining, role]);
    res.status(201).send({ message: "Employee added successfully", data: result.rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      res.status(400).send({ message: "Duplicate Employee ID or Email" });
    } else {
      console.error("Error adding employee", error);
      res.status(500).send({ message: "Error adding employee" });
    }
  }
});

// Edit Employee
app.put("/api/employees/:id", async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, employee_id, email, phone_number, department, date_of_joining, role } = req.body;

  const fullName = `${first_name} ${last_name}`; // Combine First Name and Last Name

  try {
    const result = await pool.query(
      `UPDATE employees
       SET name = $1, employee_id = $2, email = $3, phone_number = $4, department = $5, date_of_joining = $6, role = $7
       WHERE id = $8
       RETURNING *`,
      [fullName, employee_id, email, phone_number, department, date_of_joining, role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send({ message: "Employee not found" });
    }

    res.send({ message: "Employee updated successfully", data: result.rows[0] });
  } catch (error) {
    console.error("Error updating employee", error);
    res.status(500).send({ message: "Error updating employee" });
  }
});

// Delete Employee
app.delete("/api/employees/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM employees WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      res.status(404).send({ message: "Employee not found" });
    } else {
      res.send({ message: "Employee deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting employee", error);
    res.status(500).send({ message: "Error deleting employee" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
