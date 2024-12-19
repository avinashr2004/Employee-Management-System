import React, { useState, useEffect } from "react";
import axios from "axios";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [editEmployee, setEditEmployee] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordCorrect, setPasswordCorrect] = useState(false);
  const [error, setError] = useState("");
  const [searchId, setSearchId] = useState("");
  const [filteredEmployee, setFilteredEmployee] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const validPassword = "1234";

  useEffect(() => {
    if (passwordCorrect) {
      async function fetchEmployees() {
        try {
          const response = await axios.get("http://localhost:5000/api/employees");
          setEmployees(response.data);
          setEmployeeCount(response.data.length);
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
      setEmployeeCount(employeeCount - 1);
    } catch (error) {
      console.error("Error deleting employee", error);
    }
  };

  const handleEdit = (employee) => {
    setEditEmployee({ ...employee });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updatedEmployee = {
      ...editEmployee,
      name: `${editEmployee.first_name} ${editEmployee.last_name}`,
    };
    try {
      const response = await axios.put(
        `http://localhost:5000/api/employees/${updatedEmployee.id}`,
        updatedEmployee
      );
      setEmployees(
        employees.map((emp) =>
          emp.id === updatedEmployee.id ? updatedEmployee : emp
        )
      );
      setEditEmployee(null);
    } catch (error) {
      console.error("Error updating employee", error);
    }
  };

  const handleSearch = () => {
    const employee = employees.find((emp) => emp.employee_id === searchId);
    setFilteredEmployee(employee || null);
  };

  const handleFilter = () => {
    let filtered = employees;
    if (filterDepartment) {
      filtered = filtered.filter(emp => emp.department === filterDepartment);
    }
    if (filterRole) {
      filtered = filtered.filter(emp => emp.role === filterRole);
    }
    if (filterDate) {
      filtered = filtered.filter(emp => new Date(emp.date_of_joining).toLocaleDateString() === new Date(filterDate).toLocaleDateString());
    }
    setFilteredEmployee(filtered.length > 0 ? filtered : null);
  };

  return (
    <div style={containerStyle}>
      {passwordCorrect ? (
        <>
          <div style={countStyle}>
            Total Employees: {employeeCount}
          </div>

          <h2>Employee List</h2>

          {/* Search and Filter section */}
          <div style={searchContainerStyle}>
            <input
              type="text"
              placeholder="Search by Employee ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              style={searchInputStyle}
            />
            <button onClick={handleSearch} style={searchButtonStyle}>Search</button>
          </div>

          <div style={filterContainerStyle}>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              style={filterInputStyle}
            >
              <option value="">Filter by Department</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="R&D">R&D</option>
            </select>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              style={filterInputStyle}
            >
              <option value="">Filter by Role</option>
              <option value="Manager">Manager</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="Tester">Tester</option>
            </select>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={filterInputStyle}
            />
            <button onClick={handleFilter} style={filterButtonStyle}>Filter</button>
          </div>

          <div style={tableContainerStyle}>
            {filteredEmployee ? (
              <div>
                <h3>Search Result</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Employee ID</th>
                      <th>Email</th>
                      <th>Phone Number</th>
                      <th>Department</th>
                      <th>Role</th>
                      <th>Date of Joining</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(filteredEmployee) ? filteredEmployee.map(emp => (
                      <tr key={emp.id}>
                        <td>{emp.name}</td>
                        <td>{emp.employee_id}</td>
                        <td>{emp.email}</td>
                        <td>{emp.phone_number}</td>
                        <td>{emp.department}</td>
                        <td>{emp.role}</td>
                        <td>
                          {emp.date_of_joining
                            ? new Date(emp.date_of_joining).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td>
                          <button onClick={() => handleEdit(emp)}>Edit</button>
                          <button onClick={() => handleDelete(emp.id)}>Delete</button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td>{filteredEmployee.name}</td>
                        <td>{filteredEmployee.employee_id}</td>
                        <td>{filteredEmployee.email}</td>
                        <td>{filteredEmployee.phone_number}</td>
                        <td>{filteredEmployee.department}</td>
                        <td>{filteredEmployee.role}</td>
                        <td>
                          {filteredEmployee.date_of_joining
                            ? new Date(filteredEmployee.date_of_joining).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td>
                          <button onClick={() => handleEdit(filteredEmployee)}>Edit</button>
                          <button onClick={() => handleDelete(filteredEmployee.id)}>Delete</button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No employee found with the given criteria.</p>
            )}

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Employee ID</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Date of Joining</th>
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
                    <td>
                      {emp.date_of_joining
                        ? new Date(emp.date_of_joining).toLocaleDateString()
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
          </div>

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

const containerStyle = {
  height: "100vh",
  overflowY: "auto",
};

const countStyle = {
  position: "sticky",
  top: "0",
  backgroundColor: "#f8f9fa",
  padding: "10px",
  borderRadius: "5px",
  fontSize: "16px",
  fontWeight: "bold",
  border: "1px solid #ddd",
  zIndex: 1,
};

const searchContainerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  marginBottom: "20px",
};

const searchInputStyle = {
  marginRight: "10px",
  padding: "5px",
  fontSize: "16px",
  width: "25%",
};

const searchButtonStyle = {
  padding: "5px 10px",
  fontSize: "14px",
};

const filterContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const filterInputStyle = {
  marginRight: "10px",
  padding: "5px",
  fontSize: "16px",
};

const filterButtonStyle = {
  padding: "5px 10px",
  fontSize: "14px",
};

const tableContainerStyle = {
  overflowY: "auto",
};

export default EmployeeList;
