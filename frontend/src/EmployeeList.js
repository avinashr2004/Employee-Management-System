import React, { useState, useEffect } from "react";//useeffect fetch data usestae for count fucntion
import axios from "axios";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [employeeCount, setEmployeeCount] = useState(0); // New state for employee count
  const [editEmployee, setEditEmployee] = useState(null);//to update th table
  const [password, setPassword] = useState("");
  const [passwordCorrect, setPasswordCorrect] = useState(false);
  const [error, setError] = useState("");

  const validPassword = "1234"; // Correct password

  // Fetch employee data when password is correct
  useEffect(() => {
    if (passwordCorrect) {
      async function fetchEmployees() {
        try {
          const response = await axios.get("http://localhost:5000/api/employees");
          setEmployees(response.data);
          setEmployeeCount(response.data.length); // Set employee count
        } catch (error) {
          console.error("Error fetching employees", error);
        }
      }
      fetchEmployees();
    }
  }, [passwordCorrect]);

  const handlePasswordSubmit = () => {
    if (password === validPassword) {
      setPasswordCorrect(true);
      setError("");
    } else {
      setError("Incorrect password!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      setEmployees(employees.filter((employee) => employee.id !== id));
      setEmployeeCount(employeeCount - 1); // Decrease employee count
    } catch (error) {
      console.error("Error deleting employee", error);
    }
  };

  const handleEdit = (employee) => {
    setEditEmployee({ ...employee }); // Pre-fill the data into the edit form
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updatedEmployee = {
      ...editEmployee,
      name: `${editEmployee.first_name} ${editEmployee.last_name}`, // Combine first and last name
    };
    try {
      const response = await axios.put(
        `http://localhost:5000/api/employees/${updatedEmployee.id}`,
        updatedEmployee
      );
      // Update the employee list with the newly updated employee
      setEmployees(
        employees.map((emp) =>
          emp.id === updatedEmployee.id ? updatedEmployee : emp
        )
      );
      setEditEmployee(null); // Close the edit form on success
    } catch (error) {
      console.error("Error updating employee", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const updatedEmployee = {
      ...editEmployee,
      name: `${editEmployee.first_name} ${editEmployee.last_name}`, // Combine first and last name
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/api/employees/${updatedEmployee.id}`,
        updatedEmployee
      );
      // Update employee list with the newly updated employee
      setEmployees(
        employees.map((emp) =>
          emp.id === updatedEmployee.id ? updatedEmployee : emp
        )
      );
      setEmployeeCount(employees.length); // Set the updated employee count
    } catch (error) {
      console.error("Error updating employee", error);
    }
  };

  return (
    <div>
      {passwordCorrect ? (
        <>
          {/* Employee count display */}
          <div style={countStyle}>
            Total Employees: {employeeCount}
          </div>

          <h2>Employee List</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Employee ID</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Department</th>
                <th>Role</th>
                <th>Date of Joining</th> {/* Ensure Date of Joining column exists */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.employee_id}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone_number}</td>
                  <td>{emp.department}</td>
                  <td>{emp.role}</td>

                  {/* Display Date of Joining properly */}
                  <td>
                    {/* Check if date_of_joining exists and format it properly */}
                    {emp.date_of_joining
                      ? new Date(emp.date_of_joining).toLocaleDateString() // Formats the date
                      : "N/A"}
                  </td> 
                  <td>
                    <button onClick={() => handleEdit(emp)}>Edit</button>
                    <button onClick={() => handleDelete(emp.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {editEmployee && (
            <div>
              <h3>Edit Employee</h3>
              <form onSubmit={handleEditSubmit}>
                <input
                  type="text"
                  value={editEmployee.first_name}
                  onChange={(e) =>
                    setEditEmployee({ ...editEmployee, first_name: e.target.value })
                  }
                  placeholder="First Name"
                />
                <input
                  type="text"
                  value={editEmployee.last_name}
                  onChange={(e) =>
                    setEditEmployee({ ...editEmployee, last_name: e.target.value })
                  }
                  placeholder="Last Name"
                />
                <input
                  type="text"
                  value={editEmployee.employee_id}
                  onChange={(e) =>
                    setEditEmployee({ ...editEmployee, employee_id: e.target.value })
                  }
                  placeholder="Employee ID"
                />
                <input
                  type="email"
                  value={editEmployee.email}
                  onChange={(e) =>
                    setEditEmployee({ ...editEmployee, email: e.target.value })
                  }
                  placeholder="Email"
                />
                <input
                  type="text"
                  value={editEmployee.phone_number}
                  onChange={(e) =>
                    setEditEmployee({ ...editEmployee, phone_number: e.target.value })
                  }
                  placeholder="Phone Number"
                />
                <input
                  type="text"
                  value={editEmployee.department}
                  onChange={(e) =>
                    setEditEmployee({ ...editEmployee, department: e.target.value })
                  }
                  placeholder="Department"
                />
                <input
                  type="text"
                  value={editEmployee.role}
                  onChange={(e) =>
                    setEditEmployee({ ...editEmployee, role: e.target.value })
                  }
                  placeholder="Role"
                />
                <input
                  type="date"
                  value={editEmployee.date_of_joining}
                  onChange={(e) =>
                    setEditEmployee({ ...editEmployee, date_of_joining: e.target.value })
                  }
                  placeholder="Date of Joining"
                />
                <button type="submit">Save Changes</button>
              </form>
            </div>
          )}
        </>
      ) : (
        <div>
          <h2>Enter Password to Access Employee List</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
          />
          <button onClick={handlePasswordSubmit}>Submit</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}
    </div>
  );
}

const countStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  backgroundColor: "#f8f9fa",
  padding: "10px",
  borderRadius: "5px",
  fontSize: "16px",
  fontWeight: "bold",
  border: "1px solid #ddd",
};

export default EmployeeList;
