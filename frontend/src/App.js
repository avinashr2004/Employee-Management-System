import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { useForm } from "react-hook-form"; // form handling
import { yupResolver } from "@hookform/resolvers/yup"; //yup validation 
import * as yup from "yup";
import axios from "axios";//for api requqest node js and db

// Validation schema
const schema = yup.object().shape({ //structure of the validation schema
  first_name: yup.string().required("First Name is required"),
  last_name: yup.string().required("Last Name is required"),
  employee_id: yup.string().max(10, "Employee ID must be at most 10 characters").required("Employee ID is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone_number: yup.string().length(10, "Phone number must be exactly 10 digits").required("Phone number is required"),
  department: yup.string().required("Department is required"),
  date_of_joining: yup.date().max(new Date(), "Date cannot be in the future").required("Date of joining is required"),
  role: yup.string().required("Role is required")
});

function App() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  // Submit the form and combine first and last name
  const onSubmit = async (data) => {
    const fullName = `${data.first_name} ${data.last_name}`;
    const newData = { ...data, name: fullName };

    try {
      const response = await axios.post("http://localhost:5000/api/employees", newData);
      alert(response.data.message);
      reset(); // Reset form fields
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  // Reset the form (clears the input fields)
  const handleReset = () => {
    reset(); // Clears all form fields
  };

  return (
    <div style={pageContainerStyle}>
      <div style={formContainerStyle}>
        <h1>Employee Management System</h1>
        <h2>Add Employee</h2>
        <form onSubmit={handleSubmit(onSubmit)} style={formStyle}>
          <div>
            <input type="text" placeholder="First Name" {...register("first_name")} />
            <p style={errorMessageStyle}>{errors.first_name?.message}</p>
          </div>
          <div>
            <input type="text" placeholder="Last Name" {...register("last_name")} />
            <p style={errorMessageStyle}>{errors.last_name?.message}</p>
          </div>
          <div>
            <input type="text" placeholder="Employee ID" {...register("employee_id")} />
            <p style={errorMessageStyle}>{errors.employee_id?.message}</p>
          </div>
          <div>
            <input type="email" placeholder="Email" {...register("email")} />
            <p style={errorMessageStyle}>{errors.email?.message}</p>
          </div>
          <div>
            <input type="text" placeholder="Phone Number" {...register("phone_number")} />
            <p style={errorMessageStyle}>{errors.phone_number?.message}</p>
          </div>
          <div>
            <select {...register("department")}>
              <option value="">Select Department</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="R&D">R&D</option>
            </select>
            <p style={errorMessageStyle}>{errors.department?.message}</p>
          </div>
          <div>
            <input type="date" {...register("date_of_joining")} />
            <p style={errorMessageStyle}>{errors.date_of_joining?.message}</p>
          </div>
          <div>
            <input type="text" placeholder="Role" {...register("role")} />
            <p style={errorMessageStyle}>{errors.role?.message}</p>
          </div>

          <button type="button" onClick={handleReset}>Reset</button>
          <button type="submit">Submit</button>
        </form>

        {/* Box with "View Employee List" button */}
        <div style={viewEmployeeListBox}>
          <Link to="/employee-list" style={linkStyle}>View Employee List</Link>
        </div>
      </div>
    </div>
  );
}

// CSS Styles
const pageContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f4f4f4',
  padding: '0 20px', // Padding for small screens
};

const formContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  maxWidth: '600px',  // Limit the width on larger screens
  width: '100%',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
};

const errorMessageStyle = {
  color: 'red',
  fontSize: '12px',
  marginTop: '5px',
};

// Styling for the View Employee List Box
const viewEmployeeListBox = {
  marginTop: '20px',
  padding: '10px',
  backgroundColor: '#f4f4f4',
  border: '1px solid #ccc',
  borderRadius: '8px',
  textAlign: 'center',
  width: '100%',
};

const linkStyle = {
  textDecoration: 'none',
  color: '#007bff',
  fontSize: '16px',
};

export default App;
