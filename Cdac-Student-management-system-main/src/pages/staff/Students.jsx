import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { getStudents, addStudent, deleteStudent } from "../../services/api";
import { getStorageData, saveStorageData } from "../../services/mockData";
import { COURSES_DATA, getCourseBadgeStyle as getCourseBadgeTheme } from "../../services/coursesData";
import { Users, UserPlus, Search, Trash2, GraduationCap, Mail, Phone, BookOpen, Layers } from "lucide-react";

export default function Students() {
  const { user } = useAuth();
  const staffCourse = user?.course || "PGCP-AC";
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState(staffCourse);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    course: staffCourse,
    rollNo: "",
    prnNo: "",
    phone: "",
    batch: "Feb 2026",
    address: ""
  });

  // ✅ LOAD DATA FROM BACKEND / MOCK FALLBACK
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getStudents();
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStudents(res.data);
      } else {
        const local = getStorageData("students") || [];
        setStudents(local);
      }
    } catch (err) {
      console.warn("Using local storage fallback for student list:", err);
      const local = getStorageData("students") || [];
      setStudents(local);
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate roll number when course changes or modal opens
  const handleCourseChange = (selectedCourse) => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const generatedRoll = `${selectedCourse}-2026-${randomNum}`;
    setForm((prev) => ({
      ...prev,
      course: selectedCourse,
      rollNo: prev.rollNo && !prev.rollNo.startsWith(prev.course) ? prev.rollNo : generatedRoll
    }));
  };

  const handleOpenModal = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setForm({
      name: "",
      email: "",
      course: "PGCP-AC",
      rollNo: `PGCP-AC-2026-${randomNum}`,
      prnNo: "",
      phone: "",
      batch: "Feb 2026",
      address: ""
    });
    setShowModal(true);
  };

  // ✅ ADD STUDENT
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.course) {
      return alert("Please fill all required fields (Name, Email, Course)");
    }

    const rollNoFinal = form.rollNo.trim() || `${form.course}-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newStudentData = {
      name: form.name.trim(),
      email: form.email.trim(),
      course: form.course,
      rollNo: rollNoFinal,
      prnNo: form.prnNo.trim(),
      phone: form.phone.trim(),
      batch: form.batch || "Feb 2026",
      address: form.address.trim()
    };

    try {
      await addStudent(newStudentData);
    } catch (err) {
      console.warn("API save fallback to local storage:", err);
    }

    // Always update local state & LocalStorage for instant reliable reactivity
    const currentList = getStorageData("students") || students;
    const exists = currentList.some((s) => s.email?.toLowerCase() === newStudentData.email.toLowerCase());
    
    let updatedList;
    if (exists) {
      updatedList = currentList.map((s) =>
        s.email?.toLowerCase() === newStudentData.email.toLowerCase() ? { ...s, ...newStudentData } : s
      );
    } else {
      updatedList = [...currentList, { id: Date.now(), ...newStudentData }];
    }

    setStudents(updatedList);
    saveStorageData("students", updatedList);

    setShowModal(false);
    alert(`Student "${newStudentData.name}" (${newStudentData.rollNo}) registered successfully!`);
  };

  // ✅ DELETE STUDENT
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete student profile for "${name || 'this student'}"?`)) {
      try {
        await deleteStudent(id);
      } catch (err) {
        console.warn("API delete fallback:", err);
      }

      const updated = students.filter((s) => s.id !== id);
      setStudents(updated);
      saveStorageData("students", updated);
    }
  };

  // Filter students based on search and course selection
  const filteredStudents = students.filter((s) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      (s.name && s.name.toLowerCase().includes(searchLower)) ||
      (s.email && s.email.toLowerCase().includes(searchLower)) ||
      (s.rollNo && s.rollNo.toLowerCase().includes(searchLower)) ||
      (s.prnNo && s.prnNo.toLowerCase().includes(searchLower));

    const matchesCourse = courseFilter === "All" || s.course === courseFilter;
    return matchesSearch && matchesCourse;
  });

  // Calculate quick metrics
  const dacCount = students.filter((s) => s.course === "DAC").length;
  const desdCount = students.filter((s) => s.course === "DESD").length;
  const ditissCount = students.filter((s) => s.course === "DITISS").length;
  const dbdaCount = students.filter((s) => s.course === "DBDA").length;

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container} className="animate-fade-in">
        {/* HEADER ROW */}
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>
              <Users size={28} style={{ marginRight: "10px", color: "#3b82f6" }} />
              Student Directory & Enrollment
            </h1>
            <p style={styles.subtitle}>Manage student profiles, enrollments, roll numbers, and academic records</p>
          </div>
          <button style={styles.addBtn} onClick={handleOpenModal}>
            <UserPlus size={18} /> Register New Student
          </button>
        </div>

        {/* METRICS CARDS */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIconBg, background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" }}>
              <GraduationCap size={22} />
            </div>
            <div>
              <span style={styles.statLabel}>Total Enrolled</span>
              <h3 style={styles.statVal}>{students.length} Students</h3>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statIconBg, background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
              <BookOpen size={22} />
            </div>
            <div>
              <span style={styles.statLabel}>DAC Batch</span>
              <h3 style={{ ...styles.statVal, color: "#10b981" }}>{dacCount} Enrolled</h3>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statIconBg, background: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6" }}>
              <Layers size={22} />
            </div>
            <div>
              <span style={styles.statLabel}>Specializations</span>
              <h3 style={{ ...styles.statVal, color: "#8b5cf6" }}>
                DESD: {desdCount} | DITISS: {ditissCount} | DBDA: {dbdaCount}
              </h3>
            </div>
          </div>
        </div>

        {/* SEARCH & COURSE FILTER BAR */}
        <div style={styles.filterRow}>
          <div style={styles.searchBox}>
            <Search size={18} color="#64748b" />
            <input
              style={styles.searchInput}
              placeholder="Search by name, roll no, email, or PRN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            style={styles.selectFilter}
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="All">All Courses</option>
            {COURSES_DATA.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* LOADING & ERROR */}
        {loading && <div style={styles.statusMsg}>Loading student directory...</div>}
        {error && <div style={{ ...styles.statusMsg, color: "#ef4444" }}>{error}</div>}

        {/* STUDENT TABLE */}
        {!loading && (
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Roll No / PRN</th>
                  <th style={styles.th}>Student Name</th>
                  <th style={styles.th}>Email Address</th>
                  <th style={styles.th}>Course</th>
                  <th style={styles.th}>Batch</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={styles.empty}>
                      No student records found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.id || s.email} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={{ fontWeight: "700", color: "#1e293b" }}>{s.rollNo || "N/A"}</div>
                        {s.prnNo && <div style={{ fontSize: "12px", color: "#64748b" }}>PRN: {s.prnNo}</div>}
                      </td>
                      <td style={styles.td}>
                        <div style={{ fontWeight: "600", color: "#0f172a" }}>{s.name}</div>
                        {s.address && <div style={{ fontSize: "12px", color: "#64748b" }}>{s.address}</div>}
                      </td>
                      <td style={styles.td}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#475569" }}>
                          <Mail size={14} color="#94a3b8" /> {s.email}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={getCourseBadgeStyle(s.course)}>{s.course || "DAC"}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.batchTag}>{s.batch || "Feb 2026"}</span>
                      </td>
                      <td style={styles.td}>
                        {s.phone ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#475569" }}>
                            <Phone size={13} color="#94a3b8" /> {s.phone}
                          </span>
                        ) : (
                          <span style={{ color: "#cbd5e1" }}>—</span>
                        )}
                      </td>
                      <td style={styles.td}>
                        <button
                          style={styles.deleteBtn}
                          title="Delete Student Profile"
                          onClick={() => handleDelete(s.id, s.name)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* REGISTER STUDENT MODAL */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal} className="animate-fade-in">
            <h2 style={styles.modalTitle}>
              <UserPlus size={22} style={{ color: "#3b82f6", verticalAlign: "middle", marginRight: "8px" }} />
              Register New Student
            </h2>
            <p style={styles.modalSub}>Add student to academic management system database</p>

            <form onSubmit={handleAdd} style={styles.form}>
              <div style={styles.inputRow}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Full Name *</label>
                  <input
                    style={styles.input}
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Email Address *</label>
                  <input
                    type="email"
                    style={styles.input}
                    placeholder="e.g. rahul.s@cdac.in"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={styles.inputRow}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>C-DAC Course (Assigned Specialization)</label>
                  <select
                    style={{ ...styles.input, background: "#f1f5f9", cursor: "not-allowed" }}
                    value={form.course}
                    disabled
                  >
                    {COURSES_DATA.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.fullTitle}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Roll Number</label>
                  <input
                    style={styles.input}
                    placeholder="e.g. DAC-2026-001"
                    value={form.rollNo}
                    onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
                  />
                </div>
              </div>

              <div style={styles.inputRow}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>PRN Number</label>
                  <input
                    style={styles.input}
                    placeholder="e.g. 260340120001"
                    value={form.prnNo}
                    onChange={(e) => setForm({ ...form, prnNo: e.target.value })}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Batch</label>
                  <select
                    style={styles.input}
                    value={form.batch}
                    onChange={(e) => setForm({ ...form, batch: e.target.value })}
                  >
                    <option value="Feb 2026">Feb 2026</option>
                    <option value="Aug 2026">Aug 2026</option>
                  </select>
                </div>
              </div>

              <div style={styles.inputRow}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Phone Number</label>
                  <input
                    style={styles.input}
                    placeholder="e.g. +91 9876543210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Permanent Address</label>
                  <input
                    style={styles.input}
                    placeholder="City / State"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
              </div>

              <div style={styles.modalBtns}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" style={styles.saveBtn}>
                  Save Student Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Course badge color helper
const getCourseBadgeStyle = (course) => {
  const theme = getCourseBadgeTheme(course);
  return {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "700",
    background: theme.bg,
    color: theme.color,
    display: "inline-block",
  };
};

const styles = {
  page: { minHeight: "100vh", background: "#f8fafc" },
  container: { padding: "30px", maxWidth: "1200px", margin: "0 auto" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px" },
  title: { fontSize: "24px", color: "#1e293b", margin: 0, display: "flex", alignItems: "center", fontWeight: "800" },
  subtitle: { color: "#64748b", margin: "5px 0 0 0", fontSize: "14px" },
  addBtn: { display: "flex", alignItems: "center", gap: "8px", background: "#3b82f6", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "10px", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "18px", marginBottom: "25px" },
  statCard: { background: "#fff", padding: "20px", borderRadius: "14px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", display: "flex", alignItems: "center", gap: "16px" },
  statIconBg: { width: "48px", height: "48px", borderRadius: "12px", display: "flex", justifyContent: "center", alignItems: "center" },
  statLabel: { fontSize: "13px", color: "#64748b", fontWeight: "500" },
  statVal: { fontSize: "18px", fontWeight: "800", color: "#1e293b", margin: "2px 0 0 0" },
  filterRow: { display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap" },
  searchBox: { display: "flex", alignItems: "center", gap: "10px", background: "#fff", padding: "10px 16px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.04)", flex: 1, minWidth: "260px" },
  searchInput: { border: "none", outline: "none", width: "100%", fontSize: "14px" },
  selectFilter: { padding: "10px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", background: "#fff", fontSize: "14px", fontWeight: "600", color: "#334155", cursor: "pointer" },
  statusMsg: { padding: "20px", textAlign: "center", color: "#64748b", fontSize: "15px" },
  tableCard: { background: "#fff", borderRadius: "14px", boxShadow: "0 4px 14px rgba(0,0,0,0.04)", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: { padding: "14px 18px", background: "#f8fafc", borderBottom: "2px solid #e2e8f0", color: "#475569", fontSize: "13px", fontWeight: "700" },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "14px 18px", color: "#334155", fontSize: "14px" },
  batchTag: { background: "#f1f5f9", color: "#475569", padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" },
  empty: { padding: "35px", textAlign: "center", color: "#94a3b8", fontSize: "15px" },
  deleteBtn: { background: "#fee2e2", color: "#ef4444", border: "none", padding: "8px 10px", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s ease" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.5)", backdropFilter: "blur(3px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modal: { background: "#fff", width: "100%", maxWidth: "560px", padding: "28px", borderRadius: "18px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" },
  modalTitle: { margin: "0 0 4px 0", fontSize: "20px", color: "#0f172a", fontWeight: "800" },
  modalSub: { margin: "0 0 20px 0", fontSize: "13px", color: "#64748b" },
  form: { display: "flex", flexDirection: "column", gap: "14px" },
  inputRow: { display: "flex", gap: "14px" },
  label: { display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" },
  input: { width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box", background: "#f8fafc" },
  modalBtns: { display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "10px" },
  cancelBtn: { padding: "10px 18px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  saveBtn: { padding: "10px 20px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)" },
};