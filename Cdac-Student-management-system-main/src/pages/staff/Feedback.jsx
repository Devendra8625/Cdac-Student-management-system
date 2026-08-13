import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { getFeedbacks, respondFeedback, deleteFeedback } from "../../services/api";
import { getStorageData, saveStorageData } from "../../services/mockData";
import { COURSES_DATA, getModulesForCourse, getCourseBadgeStyle } from "../../services/coursesData";
import { MessageSquare, Star, Trash2, Send, CheckCircle, BookOpen } from "lucide-react";

export default function StaffFeedback() {
  const { user } = useAuth();
  const staffCourse = user?.course || "PGCP-AC";
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState("All");
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await getFeedbacks();
      if (res.data && res.data.length > 0) {
        setFeedbacks(res.data);
      } else {
        setFeedbacks(getStorageData("feedback") || []);
      }
    } catch {
      setFeedbacks(getStorageData("feedback") || []);
    } finally {
      setLoading(false);
    }
  };

  const handleSendResponse = async (id) => {
    const text = replyText[id];
    if (!text) return alert("Please enter a response message.");

    try {
      await respondFeedback(id, text);
    } catch {
      // Local fallback update
    }

    const updated = feedbacks.map((fb) => (fb.id === id ? { ...fb, response: text } : fb));
    setFeedbacks(updated);
    saveStorageData("feedback", updated);
    setReplyText((prev) => ({ ...prev, [id]: "" }));
    alert("Response saved successfully!");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feedback record?")) return;
    try {
      await deleteFeedback(id);
    } catch {
      // Local fallback
    }
    const updated = feedbacks.filter((fb) => fb.id !== id);
    setFeedbacks(updated);
    saveStorageData("feedback", updated);
  };

  const availableModules = getModulesForCourse(staffCourse);

  const courseInfo = COURSES_DATA.find(
    (c) => c.code.toLowerCase() === (staffCourse || "").toLowerCase() ||
           (staffCourse || "").toLowerCase().includes(c.code.toLowerCase()) ||
           (c.code === "PGCP-AC" && staffCourse === "DAC") ||
           (c.code === "PGCP-ESD" && staffCourse === "DESD") ||
           (c.code === "PGCP-ITISS" && staffCourse === "DITISS") ||
           (c.code === "PGCP-BDA" && staffCourse === "DBDA")
  );

  const filtered = feedbacks.filter((fb) => {
    const matchesCourse = fb.course === staffCourse || availableModules.includes(fb.subject);
    const matchesSubject = filterSubject === "All" || fb.subject === filterSubject;
    return matchesCourse && matchesSubject;
  });

  const avgRating =
    filtered.length > 0
      ? (filtered.reduce((sum, item) => sum + (Number(item.rating) || 5), 0) / filtered.length).toFixed(1)
      : "5.0";

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              <MessageSquare size={28} style={{ marginRight: "10px", color: "#ec4899" }} />
              Student Feedback Portal
            </h1>
            <p style={styles.subtitle}>Review student feedback, ratings, and course evaluations</p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <select
              style={styles.selectFilter}
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="All">All Course Modules</option>
              {availableModules.map((mod, idx) => (
                <option key={idx} value={mod}>
                  {mod}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* QUICK METRICS BAR FOR STAFF */}
        <div style={styles.metricsRow}>
          <div style={styles.metricItem}>
            <span style={styles.metricLabel}>Assigned Course</span>
            <strong style={{ ...styles.metricVal, color: "#4f46e5" }}>
              <BookOpen size={15} style={{ verticalAlign: "middle", marginRight: "6px" }} />
              {courseInfo ? courseInfo.code : staffCourse}
            </strong>
          </div>
          <div style={styles.metricItem}>
            <span style={styles.metricLabel}>Total Submissions</span>
            <strong style={styles.metricVal}>{filtered.length} Feedbacks</strong>
          </div>
          <div style={styles.metricItem}>
            <span style={styles.metricLabel}>Average Satisfaction</span>
            <strong style={{ ...styles.metricVal, color: "#f59e0b" }}>
              <Star size={14} fill="#f59e0b" color="#f59e0b" style={{ verticalAlign: "middle", marginRight: "4px" }} />
              {avgRating} / 5.0
            </strong>
          </div>
        </div>

        {loading ? (
          <p style={styles.loading}>Loading student feedback...</p>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyCard}>
            <h3>No feedback submissions found</h3>
            <p>Students have not submitted feedback for the selected criteria yet.</p>
          </div>
        ) : (
          <div style={styles.feedbackGrid}>
            {filtered.map((item) => (
              <div key={item.id} style={styles.feedbackCard}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.studentName}>{item.studentName || "Anonymous Student"}</h3>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "4px" }}>
                      {item.course && (
                        <span style={getCourseBadgeThemeStyle(item.course)}>
                          {item.course}
                        </span>
                      )}
                      <span style={styles.subjectBadge}>{item.subject}</span>
                    </div>
                  </div>

                  <div style={styles.ratingBox}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < (item.rating || 5) ? "#f59e0b" : "none"}
                        color={i < (item.rating || 5) ? "#f59e0b" : "#cbd5e1"}
                      />
                    ))}
                  </div>
                </div>

                <p style={styles.comments}>"{item.comments || item.feedbackText}"</p>

                <div style={styles.metaRow}>
                  <span style={styles.dateText}>{item.date || "Recent"}</span>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(item.id)}>
                    <Trash2 size={15} /> Delete
                  </button>
                </div>

                {item.response ? (
                  <div style={styles.responseBox}>
                    <CheckCircle size={16} color="#10b981" />
                    <div>
                      <strong>Faculty Response:</strong>
                      <p style={{ margin: "4px 0 0 0" }}>{item.response}</p>
                    </div>
                  </div>
                ) : (
                  <div style={styles.replyBox}>
                    <input
                      style={styles.replyInput}
                      placeholder="Type your response to student..."
                      value={replyText[item.id] || ""}
                      onChange={(e) =>
                        setReplyText({ ...replyText, [item.id]: e.target.value })
                      }
                    />
                    <button style={styles.sendBtn} onClick={() => handleSendResponse(item.id)}>
                      <Send size={14} /> Reply
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const getCourseBadgeThemeStyle = (course) => {
  const theme = getCourseBadgeStyle(course);
  return {
    padding: "3px 9px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "700",
    background: theme.bg,
    color: theme.color,
    display: "inline-block",
  };
};

const styles = {
  page: { minHeight: "100vh", background: "#f8fafc" },
  container: { padding: "30px", maxWidth: "1100px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px" },
  title: { fontSize: "24px", color: "#1e293b", margin: 0, display: "flex", alignItems: "center" },
  subtitle: { color: "#64748b", margin: "5px 0 0 0", fontSize: "14px" },
  selectFilter: { padding: "10px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", background: "#fff", fontSize: "14px" },
  metricsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "25px" },
  metricItem: { background: "#fff", padding: "16px 20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column" },
  metricLabel: { fontSize: "12px", color: "#64748b", fontWeight: "600" },
  metricVal: { fontSize: "18px", color: "#1e293b", marginTop: "4px", fontWeight: "700" },
  loading: { textAlign: "center", color: "#64748b", fontSize: "16px", marginTop: "40px" },
  emptyCard: { background: "#fff", padding: "40px", borderRadius: "14px", textAlign: "center", color: "#64748b" },
  feedbackGrid: { display: "flex", flexDirection: "column", gap: "20px" },
  feedbackCard: { background: "#fff", borderRadius: "14px", padding: "22px", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" },
  studentName: { margin: "0 0 4px 0", fontSize: "16px", color: "#1e293b" },
  subjectBadge: { background: "#f1f5f9", color: "#475569", padding: "3px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" },
  ratingBox: { display: "flex", gap: "3px" },
  comments: { color: "#334155", fontSize: "15px", fontStyle: "italic", lineHeight: "1.5", margin: "12px 0" },
  metaRow: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "12px", marginTop: "12px" },
  dateText: { fontSize: "12px", color: "#94a3b8" },
  deleteBtn: { display: "flex", alignItems: "center", gap: "5px", background: "#fee2e2", color: "#ef4444", border: "none", padding: "5px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  responseBox: { marginTop: "15px", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "12px 16px", borderRadius: "10px", color: "#166534", fontSize: "14px", display: "flex", gap: "10px", alignItems: "flex-start" },
  replyBox: { marginTop: "15px", display: "flex", gap: "10px" },
  replyInput: { flex: 1, padding: "9px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" },
  sendBtn: { display: "flex", alignItems: "center", gap: "6px", background: "#ec4899", color: "#fff", border: "none", padding: "9px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
};