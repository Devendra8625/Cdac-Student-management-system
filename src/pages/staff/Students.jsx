import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { getStudents, addStudent, deleteStudent } from "../../services/api";

export default function Students() {

  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    course: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ LOAD DATA FROM BACKEND
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await getStudents();
      setStudents(res.data);
    } catch (err) {
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADD STUDENT (API)
  const handleAdd = async () => {
    if (!form.name || !form.email || !form.course) {
      return alert("Fill all fields");
    }

    try {
      await addStudent(form);
      loadStudents(); // refresh list
      setForm({ name: "", email: "", course: "" });
    } catch (err) {
      alert("Error adding student");
    }
  };

  // ✅ DELETE STUDENT (API)
  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);
      loadStudents();
    } catch (err) {
      alert("Error deleting student");
    }
  };

  return (
    <div>
      <Navbar />

      <div style={styles.container}>
        <h1>Manage Students</h1>

        {/* LOADING & ERROR */}
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* FORM */}
        <div style={styles.form}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            placeholder="Course"
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
          />

          <button onClick={handleAdd}>Add Student</button>
        </div>

        {/* TABLE */}
        {!loading && (
          <table border="1" style={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.course}</td>
                  <td>
                    <button onClick={() => handleDelete(s.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px"
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  }
};