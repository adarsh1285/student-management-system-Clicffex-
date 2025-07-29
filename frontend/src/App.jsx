import React, { useState } from "react";
import StudentForm from './pages/StudentForm'
import StudentList from './components/StudentList'
import './App.css'


function App() {
  const [refresh, setRefresh] = useState(false);
  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-4">
            <StudentForm onStudentAdded={handleRefresh} />
          </div>
          <div className="col-12 col-md-8">
            <StudentList refresh={refresh} />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
