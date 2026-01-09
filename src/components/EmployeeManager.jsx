import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";

import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import "./index.css";

const EmployeeManager = () => {
  const [employees, setEmployees] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [formData, setFormData] = useState({
    Name: "",
    Role: "",
    Phone: "",
    Id: "",
  });

  // Fth empls frm Frstr
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "employees"), (snapshot) => {
      const employeeData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmployees(employeeData);
    });
    return () => unsub();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployeeId) {
        // Update
        await updateDoc(doc(db, "employees", editingEmployeeId), {
          Name: formData.Name,
          Role: formData.Role,
          Phone: Number(formData.Phone),
          Id: Number(formData.Id),
        });
      } else {
        //  new
        await addDoc(collection(db, "employees"), {
          Name: formData.Name,
          Role: formData.Role,
          Phone: Number(formData.Phone),
          Id: Number(formData.Id),
        });
      }

      // rst
      setFormData({ Name: "", Role: "", Phone: "", Id: "" });
      setEditingEmployeeId(null);
      setFormVisible(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit");
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "employees", id));
  };

  const handleEdit = (id, currentData) => {
    setFormData({
      Name: currentData.Name,
      Role: currentData.Role,
      Phone: currentData.Phone,
      Id: currentData.Id,
    });
    setEditingEmployeeId(id);
    setFormVisible(true);
  };

  const handleCancel = () => {
    setFormData({ Name: "", Role: "", Phone: "", Id: "" });
    setEditingEmployeeId(null);
    setFormVisible(false);
  };

  return (
    <div className="container">
      <h2
        style={{
          border: "2px solid black",
          borderRadius: "5px",
          padding: "5px",
        }}
      >
        Employees List
      </h2>

      <button
        onClick={() => {
          setFormVisible(!formVisible);
          if (!formVisible) {
            setFormData({ Name: "", Role: "", Phone: "", Id: "" });
            setEditingEmployeeId(null);
          }
        }}
        className="add-button"
      >
        {formVisible ? "Close Form" : "Add Employee"}
      </button>

      {formVisible && (
        <form onSubmit={handleSubmit} className="employee-form">
          <h3>{editingEmployeeId ? "Edit Employee" : "Add Employee"}</h3>
          <input
            type="text"
            name="Name"
            value={formData.Name}
            placeholder="Name"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="Role"
            value={formData.Role}
            placeholder="Role"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="Phone"
            value={formData.Phone}
            placeholder="Phone"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="Id"
            value={formData.Id}
            placeholder="Employee ID"
            onChange={handleChange}
            required
          />
          <button type="submit" className="submit-button">
            {editingEmployeeId ? "Update" : "Submit"}
          </button>
          <button type="button" onClick={handleCancel} className="cancel-button">
            Cancel
          </button>
        </form>
      )}

      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Employee ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.Name}</td>
              <td>{emp.Role}</td>
              <td>{emp.Phone}</td>
              <td>{emp.Id}</td>
              <td>
                <button
                  className="update-button"
                  onClick={() => handleEdit(emp.id, emp)}
                >
                  Update
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(emp.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeManager;
