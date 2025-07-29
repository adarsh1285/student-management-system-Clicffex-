import React, { useState } from "react";
import axios from "axios";

const StudentForm = ({ onStudentAdded }) => {
  const [student, setStudent] = useState({
    name: "",
    email: "",
    age: "",
    course: "",
  });

  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });

    if (name === "email") {
      validateEmail(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emailError || student.email === "") {
      alert("Please enter a valid email.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/students", student);
      alert("Student added successfully!");
      setStudent({ name: "", email: "", age: "", course: "" });
      onStudentAdded();
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4">
        <h4 className="mb-4 text-primary text-center">
          <i className="bi bi-person-plus-fill me-2"></i>🎓 Add New Student
        </h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter full name"
              value={student.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className={`form-control ${emailError ? "is-invalid" : ""}`}
              placeholder="Enter email address"
              value={student.email}
              onChange={handleChange}
              required
            />
            {emailError && (
              <div className="invalid-feedback">{emailError}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Age</label>
            <input
              type="number"
              name="age"
              className="form-control"
              placeholder="Enter age"
              value={student.age}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Course</label>
            <input
              type="text"
              name="course"
              className="form-control"
              placeholder="Enter course name"
              value={student.course}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            <i className="bi bi-plus-circle me-2"></i>Add Student
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
