import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { getAssignments, addAssignment, deleteAssignment } from "../../services/api";
import { getStorageData, saveStorageData } from "../../services/mockData";
import { COURSES_DATA, getModulesForCourse } from "../../services/coursesData";
import { FileText, Plus, Calendar, Trash2 } from "lucide-react";

export default function Assignments() {
  const { user } = useAuth();
  const staffCourse = user?.course || "PGCP-AC";
  const [assignments, setAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subject: "C Programming",
    dueDate: new Date().toISOString().split("T")[0],
    description: "",
    status: "Pending",
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await getAssignments();
      if (res.data && res.data.length > 0) {
        setAssignments(res.data);
      } else {
        setAssignments(getStorageData("assignments") || []);
      }
    } catch {
      setAssignments(getStorageData("assignments") || []);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      return alert("Please enter title and description.");
    }

    try {
      await addAssignment(form);
      fetchAssignments();
    } catch (err) {
      console.log("Using local storage fallback for assignments:", err);
    }

    const newAssignment = {
      ...form,
      id: Date.now(),
    };

    const updated = [newAssignment, ...assignments];
    setAssignments(updated);
    saveStorageData("assignments", updated);
    setForm({
      title: "",
      subject: "C Programming",
      dueDate: new Date().toISOString().split("T")[0],
      description: "",
      status: "Pending",
    });
    setShowModal(false);
    alert("Assignment created successfully!");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this assignment?")) {
      try {
        await deleteAssignment(id);
      } catch {
        // storage fallback
      }
      const updated = assignments.filter((a) => a.id !== id);
      setAssignments(updated);
      saveStorageData("assignments", updated);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>
              <FileText size={28} style={{ marginRight: "10px", color: "#06b6d4" }} />
              Course Assignments Management
            </h1>
            <p style={styles.subtitle}>Create, schedule, and grade student course assignments</p>
          </div>

          <button style={styles.addBtn} onClick={() => setShowModal(true)}>
            <Plus size={18} /> Create Assignment
          </button>
        </div>

        {/* LIST */}
        <div style={styles.grid}>
          {assignments.length === 0 ? (
            <p style={styles.empty}>No course assignments created yet.</p>
          ) : (
            assignments.map((item) => (
              <div key={item.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.subjectBadge}>{item.subject}</span>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(item.id)}>
                    <Trash2 size={15} />
                  </button>
                </div>

                <h3 style={styles.cardTitle}>{item.title}</h3>
                <p style={styles.desc}>{item.description}</p>

                <div style={styles.footerRow}>
                  <span style={styles.dateText}>
                    <Calendar size={14} /> Due Date: {item.dueDate}
                  </span>
                  <span style={styles.subCount}>📥 18 Submissions</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Create Course Assignment</h2>
            <form onSubmit={handleSave} style={styles.form}>
              <input
                style={styles.input}
                placeholder="Assignment Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />

              <select
                style={styles.input}
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              >
                {getModulesForCourse(staffCourse).map((mod, idx) => (
                  <option key={idx} value={mod}>
                    {mod}
                  </option>
                ))}
              </select>

              <input
                type="date"
                style={styles.input}
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                required
              />

              <textarea
                style={styles.textarea}
                rows={4}
                placeholder="Detailed Assignment Instructions..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />

              <div style={styles.modalBtns}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" style={styles.saveBtn}>
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f8fafc" },
  container: { padding: "30px", maxWidth: "1200px", margin: "0 auto" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px" },
  title: { fontSize: "24px", color: "#1e293b", margin: 0, display: "flex", alignItems: "center" },
  subtitle: { color: "#64748b", margin: "5px 0 0 0", fontSize: "14px" },
  addBtn: { display: "flex", alignItems: "center", gap: "8px", background: "#06b6d4", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" },
  card: { background: "#fff", padding: "20px", borderRadius: "14px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  subjectBadge: { background: "#e0f2fe", color: "#0369a1", padding: "4px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: "bold" },
  deleteBtn: { background: "none", border: "none", color: "#ef4444", cursor: "pointer" },
  cardTitle: { margin: "0 0 10px 0", color: "#1e293b", fontSize: "17px" },
  desc: { color: "#475569", fontSize: "14px", lineHeight: "1.5", margin: "0 0 15px 0", flex: 1 },
  footerRow: { borderTop: "1px solid #f1f5f9", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  dateText: { display: "inline-flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "13px" },
  subCount: { fontSize: "13px", color: "#10b981", fontWeight: "600" },
  empty: { color: "#94a3b8", textAlign: "center", gridColumn: "1 / -1", padding: "30px" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modal: { background: "#fff", width: "450px", padding: "25px", borderRadius: "14px", boxShadow: "0 10px 25px rgba(0,0,0,0.15)" },
  modalTitle: { margin: "0 0 15px 0", fontSize: "18px", color: "#1e293b" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: { padding: "11px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" },
  textarea: { padding: "11px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", fontFamily: "inherit" },
  modalBtns: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" },
  cancelBtn: { padding: "9px 16px", background: "#e2e8f0", border: "none", borderRadius: "8px", cursor: "pointer" },
  saveBtn: { padding: "9px 16px", background: "#06b6d4", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
};