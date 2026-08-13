import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { getMarks, getMarksByStudent } from "../../services/api";
import { getStorageData } from "../../services/mockData";
import { BookOpen, CheckCircle, TrendingUp } from "lucide-react";

export default function Marks() {
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    fetchStudentMarks();
  }, []);

  const fetchStudentMarks = async () => {
    try {
      const res = await getMarks();
      if (res.data && res.data.length > 0) {
        const formatted = res.data.map((m) => ({
          ...m,
          score: m.marksObtained,
          maxScore: m.maxMarks,
        }));
        setMarks(formatted);
      } else {
        loadFallback();
      }
    } catch {
      loadFallback();
    }
  };

  const loadFallback = () => {
    const data = getStorageData("marks") || [];
    const studentMarks = data.filter((m) => m.studentId === "DAC-2026-001");
    setMarks(studentMarks.length > 0 ? studentMarks : data.slice(0, 3));
  };

  const totalScore = marks.reduce((sum, m) => sum + m.score, 0);
  const totalMax = marks.reduce((sum, m) => sum + m.maxScore, 0);
  const overallPct = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            <BookOpen size={28} style={{ marginRight: "10px", color: "#22c55e" }} />
            My Examination Marks
          </h1>
          <p style={styles.subtitle}>Module-wise scorecards and percentage breakdown</p>
        </div>

        {/* OVERALL STATS */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Total Score</span>
            <span style={styles.statVal}>{totalScore} / {totalMax}</span>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statLabel}>Overall Percentage</span>
            <span style={{ ...styles.statVal, color: "#22c55e" }}>
              <TrendingUp size={18} style={{ marginRight: "5px" }} />
              {overallPct}%
            </span>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statLabel}>Academic Status</span>
            <span style={{ ...styles.statVal, color: "#10b981" }}>
              <CheckCircle size={18} style={{ marginRight: "5px" }} /> Passed
            </span>
          </div>
        </div>

        {/* MARKS TABLE */}
        <div style={styles.tableCard}>
          <h3 style={styles.cardHeader}>Module Score Breakdown</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Subject Name</th>
                  <th style={styles.th}>Score Obtained</th>
                  <th style={styles.th}>Maximum Marks</th>
                  <th style={styles.th}>Percentage</th>
                  <th style={styles.th}>Exam Date</th>
                  <th style={styles.th}>Result</th>
                </tr>
              </thead>
              <tbody>
                {marks.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={styles.empty}>No examination marks published yet.</td>
                  </tr>
                ) : (
                  marks.map((m) => {
                    const pct = Math.round((m.score / m.maxScore) * 100);
                    const isPass = pct >= 50;
                    return (
                      <tr key={m.id} style={styles.tr}>
                        <td style={styles.td}><strong>{m.subject}</strong></td>
                        <td style={styles.td}>
                          <span style={styles.scoreText}>{m.score}</span>
                        </td>
                        <td style={styles.td}>{m.maxScore}</td>
                        <td style={styles.td}>
                          <span style={getPctBadge(pct)}>{pct}%</span>
                        </td>
                        <td style={styles.td}>{m.examDate || "2026-03-20"}</td>
                        <td style={styles.td}>
                          {isPass ? (
                            <span style={styles.passBadge}>PASS</span>
                          ) : (
                            <span style={styles.failBadge}>FAIL</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
  scoreText: { fontWeight: "bold", fontSize: "16px", color: "#1e293b" },
  passBadge: { background: "#dcfce7", color: "#15803d", padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold" },
  failBadge: { background: "#fee2e2", color: "#b91c1c", padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold" },
  empty: { padding: "30px", textAlign: "center", color: "#94a3b8" },
};