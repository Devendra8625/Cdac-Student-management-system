import { useState } from "react";
import Navbar from "../../components/Navbar";
import { ClipboardList, CheckCircle2, AlertCircle } from "lucide-react";

export default function Attendance() {
  const [subjects] = useState([
    { id: 1, subject: "Advanced Java", present: 28, total: 30, percentage: 93 },
    { id: 2, subject: "Database Technologies", present: 24, total: 26, percentage: 92 },
    { id: 3, subject: "Web Programming", present: 26, total: 30, percentage: 86 },
    { id: 4, subject: "Operating Systems", present: 22, total: 24, percentage: 91 },
    { id: 5, subject: "Software Engineering", present: 18, total: 20, percentage: 90 },
  ]);

  const totalPresent = subjects.reduce((sum, s) => sum + s.present, 0);
  const totalLectures = subjects.reduce((sum, s) => sum + s.total, 0);
  const overallPercentage = Math.round((totalPresent / totalLectures) * 100);

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            <ClipboardList size={28} style={{ marginRight: "10px", color: "#ef4444" }} />
            My Attendance Record
          </h1>
          <p style={styles.subtitle}>Subject-wise attendance percentage and exam eligibility</p>
        </div>

        {/* OVERALL STATS */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Overall Attendance</span>
            <span style={{ ...styles.statVal, color: "#ef4444" }}>{overallPercentage}%</span>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statLabel}>Lectures Attended</span>
            <span style={styles.statVal}>{totalPresent} / {totalLectures}</span>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statLabel}>Exam Eligibility</span>
            <span style={{ ...styles.statVal, color: "#10b981" }}>
              <CheckCircle2 size={18} style={{ marginRight: "6px" }} /> Eligible (Min 75%)
            </span>
          </div>
        </div>

        {/* SUBJECT-WISE LIST */}
        <div style={styles.tableCard}>
          <h3 style={styles.cardHeader}>Subject Attendance Details</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Subject</th>
                  <th style={styles.th}>Lectures Attended</th>
                  <th style={styles.th}>Total Conducted</th>
                  <th style={styles.th}>Attendance Progress</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((s) => (
                  <tr key={s.id} style={styles.tr}>
                    <td style={styles.td}><strong>{s.subject}</strong></td>
                    <td style={styles.td}>{s.present}</td>
                    <td style={styles.td}>{s.total}</td>
                    <td style={styles.td}>
                      <div style={styles.progressContainer}>
                        <div style={styles.barOuter}>
                          <div
                            style={{
                              ...styles.barInner,
                              width: `${s.percentage}%`,
                              background: s.percentage >= 75 ? "#22c55e" : "#ef4444",
                            }}
                          />
                        </div>
                        <span style={styles.pctText}>{s.percentage}%</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      {s.percentage >= 75 ? (
                        <span style={styles.goodBadge}>
                          <CheckCircle2 size={13} /> Good
                        </span>
                      ) : (
                        <span style={styles.warnBadge}>
                          <AlertCircle size={13} /> Low Attendance
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
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
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "25px" },
  statCard: { background: "#fff", padding: "20px", borderRadius: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  statLabel: { fontSize: "13px", color: "#64748b" },
  statVal: { fontSize: "22px", fontWeight: "bold", color: "#1e293b", marginTop: "6px", display: "flex", alignItems: "center" },
  tableCard: { background: "#fff", borderRadius: "14px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", overflow: "hidden" },
  cardHeader: { padding: "18px 24px", margin: 0, background: "#f1f5f9", fontSize: "16px", color: "#334155" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: { padding: "14px 20px", background: "#fff", borderBottom: "2px solid #e2e8f0", color: "#64748b", fontSize: "13px", fontWeight: "600" },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "16px 20px", color: "#334155", fontSize: "14px" },
  progressContainer: { display: "flex", alignItems: "center", gap: "10px", width: "200px" },
  barOuter: { flex: 1, height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" },
  barInner: { height: "100%", borderRadius: "4px" },
  pctText: { fontSize: "13px", fontWeight: "bold", color: "#334155", minWidth: "35px" },
  goodBadge: { display: "inline-flex", alignItems: "center", gap: "4px", background: "#dcfce7", color: "#15803d", padding: "4px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: "bold" },
  warnBadge: { display: "inline-flex", alignItems: "center", gap: "4px", background: "#fee2e2", color: "#b91c1c", padding: "4px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: "bold" },
};