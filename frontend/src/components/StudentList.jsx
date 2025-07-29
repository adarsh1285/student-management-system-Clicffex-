import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentList = ({ refresh }) => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");


  const [showModal, setShowModal] = useState(false); // modal show/hide ke liye
  const [selectedStudent, setSelectedStudent] = useState(null); // jiska detail dikhana hai

  

  // Jab user 'View Details' pe click kare
  const openModal = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  // Modal band karne ke liye
  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };
  useEffect(() => {
    fetchStudents();
  }, [refresh]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students");
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Search input ke change par ye function chalega
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearch(query);

    if (query.trim() === "") {
      fetchStudents(); // agar input khali hai to pura list dikhao
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/students/search?name=${query}`
      );
      setStudents(res.data); // filtered data set karo
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      alert("Student deleted successfully");
      fetchStudents(); // updated list fetch karo
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };


  return (
    <div className="container mt-4 text-primary">
      <h3>🔷 All Students</h3>
      {/* Search Input */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by Name..."
        value={search}
        onChange={handleSearch}
      />
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Course</th>
            <th>Actions</th>
            <th>details</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, idx) => (
            <tr key={student._id}>
              <td>{idx + 1}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.age}</td>
              <td>{student.course}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(student._id)}
                >
                  Delete
                </button>
              </td>
              <td>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => openModal(student)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
       {/* Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={closeModal}
        >
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()} // modal ke andar click pe close na ho
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Student Details</h5>
              </div>
              <div className="modal-body">
                <p><b>Name:</b> {selectedStudent.name}</p>
                <p><b>Email:</b> {selectedStudent.email}</p>
                <p><b>Age:</b> {selectedStudent.age}</p>
                <p><b>Course:</b> {selectedStudent.course}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
