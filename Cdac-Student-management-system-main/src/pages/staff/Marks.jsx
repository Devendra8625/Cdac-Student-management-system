import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { getMarks, addMarks, deleteMarks } from "../../services/api";
import { getStorageData, saveStorageData } from "../../services/mockData";
import { COURSES_DATA, getModulesForCourse } from "../../services/coursesData";
import { BookOpen, Plus, Search, Trash2 } from "lucide-react";

export default function Marks() {
  const { user } = useAuth();
  const staffCourse = user?.course || "PGCP-AC";
  const [marksList, setMarksList] = useState([]);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    studentId: "",
    studentName: "",
    subject: "C Programming",
    score: "",
    maxScore: 100,
    examDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      const res = await getMarks();
      if (res.data && res.data.length > 0) {
        setMarksList(res.data);
      } else {
        setMarksList(getStorageData("marks") || []);
      }
    } catch {
      setMarksList(getStorageData("marks") || []);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.studentName || !form.score) {
      return alert("Please fill all required fields");
    }

    const newEntry = {
      studentId: Number(form.studentId) || 1,
      subject: form.subject,
      marksObtained: Number(form.score),
      maxMarks: Number(form.maxScore),
      examDate: form.examDate,
    };

    try {
      await addMarks(newEntry);
      fetchMarks();
    } catch (err) {
      console.log("Using storage fallback for marks:", err);
    }

    const updated = [
      ...marksList,
      {
        ...form,
        id: Date.now(),
        score: Number(form.score),
        maxScore: Number(form.maxScore),
      },
    ];
    setMarksList(updated);
    saveStorageData("marks", updated);
    setForm({
      studentId: "",
      studentName: "",
      subject: "C Programming",
      score: "",
      maxScore: 100,
      examDate: new Date().toISOString().split("T")[0],
    });
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this marks entry?")) {
      try {
        await deleteMarks(id);
      } catch {
        // storage fallback
      }
      const updated = marksList.filter((m) => m.id !== id);
      setMarksList(updated);
      saveStorageData("marks", updated);
    }
  };

  const availableFilterModules = getModulesForCourse(staffCourse);

  const filtered = marksList.filter((m) => {
    const searchLower = (search || "").toLowerCase();
    const sName = String(m?.studentName || "").toLowerCase();
    const sId = String(m?.studentId || "").toLowerCase();
    const matchesSearch = sName.includes(searchLower) || sId.includes(searchLower);
    const matchesSubject = subjectFilter === "All" || m?.subject === subjectFilter;
    const matchesCourse = availableFilterModules.includes(m?.subject);
    return matchesSearch && matchesSubject && matchesCourse;
  });

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>
              <BookOpen size={28} style={{ marginRight: "10px", color: "#10b981" }} />
              Marks Management
            </h1>
            <p style={styles.subtitle}>Upload and publish student module examination marks</p>
          </div>
          <button style={styles.addBtn} onClick={() => setShowModal(true)}>
            <Plus size={18} /> Add Marks Entry
          </button>
        </div>

        {/* SEARCH & FILTER */}
        <div style={styles.filterRow}>
          <div style={styles.searchBox}>
            <Search size={18} color="#64748b" />
            <input
              style={styles.searchInput}
              placeholder="Search student ID or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <select
              style={styles.selectFilter}
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="All">All Course Modules</option>
              {availableFilterModules.map((mod, idx) => (
                <option key={idx} value={mod}>
                  {mod}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Student Roll / ID</th>
                <th style={styles.th}>Student Name</th>
                <th style={styles.th}>Subject</th>
                <th style={styles.th}>Marks Obtained</th>
                <th style={styles.th}>Percentage</th>
                <th style={styles.th}>Exam Date</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={styles.empty}>No marks records found.</td>
                </tr>
              ) : (
                filtered.map((m) => {
                  const pct = Math.round((m.score / m.maxScore) * 100);
                  return (
                    <tr key={m.id} style={styles.tr}>
                      <td style={styles.td}><strong>{m.studentId}</strong></td>
                      <td style={styles.td}>{m.studentName}</td>
                      <td style={styles.td}>{m.subject}</td>
                      <td style={styles.td}>
                        <strong>{m.score}</strong> / {m.maxScore}
                      </td>
                      <td style={styles.td}>
                        <span style={getPctBadge(pct)}>{pct}%</span>
                      </td>
                      <td style={styles.td}>{m.examDate}</td>
                      <td style={styles.td}>
                        <button style={styles.deleteBtn} onClick={() => handleDelete(m.id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Add Examination Marks</h2>
            <form onSubmit={handleSave} style={styles.form}>
              <input
                style={styles.input}
                placeholder="Student Roll / ID (e.g. DAC-2026-001)"
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                required
              />
              <input
                style={styles.input}
                placeholder="Student Full Name"
                value={form.studentName}
                onChange={(e) => setForm({ ...form, studentName: e.target.value })}
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
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="number"
                  style={{ ...styles.input, flex: 1 }}
                  placeholder="Obtained Score"
                  value={form.score}
                  onChange={(e) => setForm({ ...form, score: e.target.value })}
                  required
                />
                <input
                  type="number"
                  style={{ ...styles.input, flex: 1 }}
                  placeholder="Max Score"
                  value={form.maxScore}
                  onChange={(e) => setForm({ ...form, maxScore: e.target.value })}
                  required
                />
              </div>
              <input
                type="date"
                style={styles.input}
                value={form.examDate}
                onChange={(e) => setForm({ ...form, examDate: e.target.value })}
                required
              />

              <div style={styles.modalBtns}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" style={styles.saveBtn}>
                  Publish Marks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const getPctBadge = (pct) => {
  let bg = "#dbeafe";
  let color = "#1e40af";
  if (pct >= 85) { bg = "#dcfce7"; color = "#166534"; }
  else if (pct < 60) { bg = "#fee2e2"; color = "#991b1b"; }

  return {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
    background: bg,
    color: color,
  };
};

const styles = {
  page: { minHeight: "100vh", background: "#f8fafc" },
  container: { padding: "30px", maxWidth: "1200px", margin: "0 auto" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px" },
  title: { fontSize: "24px", color: "#1e293b", margin: 0, display: "flex", alignItems: "center" },
  subtitle: { color: "#64748b", margin: "5px 0 0 0", fontSize: "14px" },
  addBtn: { display: "flex", alignItems: "center", gap: "8px", background: "#10b981", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  filterRow: { display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap" },
  searchBox: { display: "flex", alignItems: "center", gap: "10px", background: "#fff", padding: "10px 16px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.04)", flex: 1, minWidth: "260px" },
  searchInput: { border: "none", outline: "none", width: "100%", fontSize: "14px" },
  selectFilter: { padding: "10px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", background: "#fff", fontSize: "14px" },
  tableCard: { background: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: { padding: "14px 18px", background: "#f1f5f9", color: "#475569", fontSize: "13px", fontWeight: "600" },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "14px 18px", color: "#334155", fontSize: "14px" },
  empty: { padding: "30px", textAlign: "center", color: "#94a3b8" },
  deleteBtn: { background: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modal: { background: "#fff", width: "450px", padding: "25px", borderRadius: "14px", boxShadow: "0 10px 25px rgba(0,0,0,0.15)" },
  modalTitle: { margin: "0 0 15px 0", fontSize: "18px", color: "#1e293b" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: { padding: "11px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" },
  modalBtns: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" },
  cancelBtn: { padding: "9px 16px", background: "#e2e8f0", border: "none", borderRadius: "8px", cursor: "pointer" },
  saveBtn: { padding: "9px 16px", background: "#10b981", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
};