import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { getStudents, addAttendance, getAttendance } from "../../services/api";
import { getStorageData, saveStorageData } from "../../services/mockData";
import { COURSES_DATA, getModulesForCourse } from "../../services/coursesData";
import { ClipboardList, CheckCircle2, XCircle, Calendar } from "lucide-react";

export default function Attendance() {
  const { user } = useAuth();
  const staffCourse = user?.course || "PGCP-AC";
  const [students, setStudents] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [subject, setSubject] = useState("C Programming");
  const [studentStatus, setStudentStatus] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await getStudents();
      if (res.data && res.data.length > 0) {
        setStudents(res.data);
        const initialMap = {};
        res.data.forEach((s) => {
          initialMap[s.id] = true;
        });
        setStudentStatus(initialMap);
      } else {
        loadFallbackStudents();
      }
    } catch {
      loadFallbackStudents();
    }

    try {
      const attRes = await getAttendance();
      if (attRes.data) setAttendanceHistory(attRes.data);
      else setAttendanceHistory(getStorageData("attendance") || []);
    } catch {
      setAttendanceHistory(getStorageData("attendance") || []);
    }
  };

  const loadFallbackStudents = () => {
    const list = getStorageData("students") || [];
    setStudents(list);
    const initialMap = {};
    list.forEach((s) => {
      initialMap[s.id] = true;
    });
    setStudentStatus(initialMap);
  };

  const toggleStatus = (id) => {
    setStudentStatus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSaveAttendance = async () => {
    const presentCount = Object.values(studentStatus).filter(Boolean).length;
    const newRecord = {
      id: Date.now(),
      date: selectedDate,
      subject: subject,
      totalStudents: students.length,
      presentCount: presentCount,
      status: "Completed",
    };

    try {
      for (const s of students) {
        await addAttendance({
          studentId: s.id,
          date: selectedDate,
          subject: subject,
          status: studentStatus[s.id] ? "PRESENT" : "ABSENT",
        });
      }
    } catch (err) {
      console.log("Saving locally to storage:", err);
    }

    const updated = [newRecord, ...attendanceHistory];
    setAttendanceHistory(updated);
    saveStorageData("attendance", updated);
    alert(`Attendance saved successfully for ${selectedDate}! (${presentCount}/${students.length} Present)`);
  };

  const presentCount = Object.values(studentStatus).filter(Boolean).length;
  const absentCount = students.length - presentCount;

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            <ClipboardList size={28} style={{ marginRight: "10px", color: "#ef4444" }} />
            Attendance Management
          </h1>
          <p style={styles.subtitle}>Mark daily student attendance by subject and date</p>
        </div>

        {/* SELECTOR BAR */}
        <div style={styles.controlsCard}>
          <div style={styles.controlGroup}>
            <label style={styles.label}>
              <Calendar size={16} /> Select Date:
            </label>
            <input
              type="date"
              style={styles.input}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div style={styles.controlGroup}>
            <label style={styles.label}>Select Subject:</label>
            <select
              style={styles.input}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              {getModulesForCourse(staffCourse).map((mod, idx) => (
                <option key={idx} value={mod}>
                  {mod}
                </option>
              ))}
            </select>
          </div>

          <button style={styles.saveBtn} onClick={handleSaveAttendance}>
            Submit Attendance Sheet
          </button>
        </div>

        {/* STATS */}
        <div style={styles.statsRow}>
          <div style={{ ...styles.statBox, borderColor: "#10b981" }}>
            <span style={{ color: "#10b981", fontWeight: "bold", fontSize: "18px" }}>
              {presentCount}
            </span>
            <span style={styles.statSub}>Present Students</span>
          </div>

          <div style={{ ...styles.statBox, borderColor: "#ef4444" }}>
            <span style={{ color: "#ef4444", fontWeight: "bold", fontSize: "18px" }}>
              {absentCount}
            </span>
            <span style={styles.statSub}>Absent Students</span>
          </div>

          <div style={{ ...styles.statBox, borderColor: "#6366f1" }}>
            <span style={{ color: "#6366f1", fontWeight: "bold", fontSize: "18px" }}>
              {students.length}
            </span>
            <span style={styles.statSub}>Total Enrolled</span>
          </div>
        </div>

        {/* STUDENT ATTENDANCE LIST */}
        <div style={styles.listCard}>
          <h3 style={styles.cardHeader}>Student Roll Sheet</h3>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Roll No</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Course</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Toggle Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const isPresent = !!studentStatus[s.id];
                  return (
                    <tr key={s.id} style={styles.tr}>
                      <td style={styles.td}><strong>{s.rollNo}</strong></td>
                      <td style={styles.td}>{s.name}</td>
                      <td style={styles.td}>{s.course}</td>
                      <td style={styles.td}>
                        {isPresent ? (
                          <span style={styles.presentBadge}>
                            <CheckCircle2 size={14} /> Present
                          </span>
                        ) : (
                          <span style={styles.absentBadge}>
                            <XCircle size={14} /> Absent
                          </span>
                        )}
                      </td>
                      <td style={styles.td}>
                        <button
                          style={isPresent ? styles.btnAbsent : styles.btnPresent}
                          onClick={() => toggleStatus(s.id)}
                        >
                          Mark {isPresent ? "Absent" : "Present"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f8fafc" },
  container: { padding: "30px", maxWidth: "1100px", margin: "0 auto" },
  header: { marginBottom: "25px" },
  title: { fontSize: "24px", color: "#1e293b", margin: 0, display: "flex", alignItems: "center" },
  subtitle: { color: "#64748b", margin: "5px 0 0 0", fontSize: "14px" },
  controlsCard: { background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", display: "flex", gap: "20px", alignItems: "flex-end", flexWrap: "wrap", marginBottom: "25px" },
  controlGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#475569", display: "flex", alignItems: "center", gap: "6px" },
  input: { padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", background: "#fff" },
  saveBtn: { padding: "11px 20px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", marginLeft: "auto" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "25px" },
  statBox: { background: "#fff", padding: "16px", borderRadius: "12px", borderLeft: "4px solid #cbd5e1", boxShadow: "0 2px 6px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column" },
  statSub: { fontSize: "13px", color: "#64748b", marginTop: "4px" },
  listCard: { background: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", overflow: "hidden" },
  cardHeader: { padding: "16px 20px", margin: 0, background: "#f1f5f9", fontSize: "16px", color: "#334155" },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: { padding: "12px 18px", background: "#fff", borderBottom: "2px solid #e2e8f0", color: "#64748b", fontSize: "13px", fontWeight: "600" },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "14px 18px", color: "#334155", fontSize: "14px" },
  presentBadge: { display: "inline-flex", alignItems: "center", gap: "5px", background: "#dcfce7", color: "#15803d", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" },
  absentBadge: { display: "inline-flex", alignItems: "center", gap: "5px", background: "#fee2e2", color: "#b91c1c", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" },
  btnPresent: { padding: "6px 14px", background: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
  btnAbsent: { padding: "6px 14px", background: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
};