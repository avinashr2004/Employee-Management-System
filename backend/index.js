const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// PostgreSQL Pool Configuration
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "form",
  password: "Avimohana.04",
  port: 5432,
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
  const fullName = `${first_name} ${last_name}`;

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
  const {
    first_name,
    last_name,
    employee_id,
    email,
    phone_number,
    department,
    date_of_joining,
    role,
  } = req.body;

  const fullName = `${first_name} ${last_name}`;

  try {
    const result = await pool.query(
      `UPDATE employees
       SET name = $1, employee_id = $2, email = $3, phone_number = $4, department = $5, date_of_joining = $6, role = $7
       WHERE id = $8
       RETURNING *`,
      [
        fullName,
        employee_id,
        email,
        phone_number,
        department,
        date_of_joining,
        role,
        id,
      ]
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
