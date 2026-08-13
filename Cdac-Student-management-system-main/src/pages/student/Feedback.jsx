import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { getFeedbacks, addFeedback, getStudentByEmail } from "../../services/api";
import { getStorageData, saveStorageData } from "../../services/mockData";
import { COURSES_DATA, getModulesForCourse } from "../../services/coursesData";
import { MessageSquare, Star, Send, BookOpen } from "lucide-react";

export default function Feedback() {
  const { user } = useAuth();
  const [feedbackList, setFeedbackList] = useState([]);
  const [studentCourse, setStudentCourse] = useState("PGCP-AC");
  const [form, setForm] = useState({
    subject: "C Programming",
    faculty: "Prof. S. R. Kulkarni",
    rating: 5,
    comments: "",
  });

  useEffect(() => {
    fetchStudentProfileAndFeedbacks();
  }, [user]);

  const fetchStudentProfileAndFeedbacks = async () => {
    let detectedCourse = user?.course || "PGCP-AC";
    try {
      const userEmail = user?.email || "student@cdac.in";
      const res = await getStudentByEmail(userEmail);
      if (res && res.data && res.data.course) {
        detectedCourse = res.data.course;
      }
    } catch {
      const students = getStorageData("students") || [];
      const current = students.find((s) => s.email === user?.email);
      if (current && current.course) {
        detectedCourse = current.course;
      }
    }

    setStudentCourse(detectedCourse);
    const courseModules = getModulesForCourse(detectedCourse);
    if (courseModules && courseModules.length > 0) {
      setForm((prev) => ({ ...prev, subject: courseModules[0] }));
    }

    try {
      const res = await getFeedbacks();
      if (res.data && res.data.length > 0) {
        setFeedbackList(res.data);
      } else {
        setFeedbackList(getStorageData("feedback") || []);
      }
    } catch {
      setFeedbackList(getStorageData("feedback") || []);
    }
  };

  const courseInfo = COURSES_DATA.find(
    (c) => c.code.toLowerCase() === (studentCourse || "").toLowerCase() ||
           (studentCourse || "").toLowerCase().includes(c.code.toLowerCase()) ||
           (c.code === "PGCP-AC" && studentCourse === "DAC") ||
           (c.code === "PGCP-ESD" && studentCourse === "DESD") ||
           (c.code === "PGCP-ITISS" && studentCourse === "DITISS") ||
           (c.code === "PGCP-BDA" && studentCourse === "DBDA")
  );

  const availableModules = getModulesForCourse(studentCourse);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.comments.trim()) {
      return alert("Please write your feedback message.");
    }

    try {
      await addFeedback({
        subject: form.subject,
        comments: form.comments,
        rating: form.rating,
        studentName: user?.name || "Student User",
        course: studentCourse,
      });
      fetchStudentProfileAndFeedbacks();
    } catch (err) {
      console.log("Using storage fallback for feedback:", err);
    }

    const newFeedback = {
      ...form,
      course: studentCourse,
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
    };

    const updated = [newFeedback, ...feedbackList];
    setFeedbackList(updated);
    saveStorageData("feedback", updated);
    setForm((prev) => ({
      ...prev,
      comments: "",
      rating: 5,
    }));
    alert("Thank you! Feedback submitted successfully.");
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            <MessageSquare size={28} style={{ marginRight: "10px", color: "#14b8a6" }} />
            Course & Faculty Feedback
          </h1>
          <p style={styles.subtitle}>Provide constructive module feedback for your enrolled C-DAC program</p>
        </div>

        <div style={styles.grid}>
          {/* FEEDBACK FORM */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Submit Module Feedback</h3>
            
            {/* ENROLLED COURSE DISPLAY BADGE */}
            <div style={styles.courseBadgeBox}>
              <BookOpen size={18} color="#0d9488" />
              <div>
                <span style={styles.courseBadgeLabel}>Your Enrolled Course</span>
                <div style={styles.courseBadgeTitle}>
                  {courseInfo ? courseInfo.fullTitle : `Course: ${studentCourse}`}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div>
                <label style={styles.label}>Select Module *</label>
                <select
                  style={styles.input}
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                >
                  {availableModules.map((mod, idx) => (
                    <option key={idx} value={mod}>
                      {mod}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={styles.label}>Faculty Name</label>
                <input
                  style={styles.input}
                  placeholder="e.g. Prof. S. R. Kulkarni"
                  value={form.faculty}
                  onChange={(e) => setForm({ ...form, faculty: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={styles.label}>Module Rating</label>
                <div style={styles.starRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={26}
                      color={star <= form.rating ? "#f59e0b" : "#cbd5e1"}
                      fill={star <= form.rating ? "#f59e0b" : "none"}
                      style={{ cursor: "pointer" }}
                      onClick={() => setForm({ ...form, rating: star })}
                    />
                  ))}
                  <span style={styles.ratingVal}>{form.rating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <label style={styles.label}>Detailed Feedback Comments</label>
                <textarea
                  style={styles.textarea}
                  rows={4}
                  placeholder="Share your thoughts about course pace, clarity, and practical sessions..."
                  value={form.comments}
                  onChange={(e) => setForm({ ...form, comments: e.target.value })}
                  required
                />
              </div>

              <button type="submit" style={styles.submitBtn}>
                <Send size={16} /> Submit Feedback
              </button>
            </form>
          </div>

          {/* PAST SUBMISSIONS */}
          <div style={styles.historyCard}>
            <h3 style={styles.cardTitle}>My Submitted Feedback History</h3>
            <div style={styles.historyList}>
              {feedbackList.length === 0 ? (
                <p style={styles.empty}>No feedback submitted yet.</p>
              ) : (
                feedbackList.map((item) => (
                  <div key={item.id} style={styles.itemBox}>
                    <div style={styles.itemHeader}>
                      <strong>{item.subject}</strong>
                      <span style={styles.dateText}>{item.date}</span>
                    </div>

                    <div style={styles.facultyText}>Faculty: {item.faculty}</div>

                    <div style={styles.starsRender}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          color={s <= item.rating ? "#f59e0b" : "#cbd5e1"}
                          fill={s <= item.rating ? "#f59e0b" : "none"}
                        />
                      ))}
                    </div>

                    <p style={styles.commentText}>"{item.comments}"</p>
                  </div>
                ))
              )}
            </div>
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
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" },
  card: { background: "#fff", padding: "24px", borderRadius: "14px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
  cardTitle: { margin: "0 0 16px 0", fontSize: "17px", color: "#1e293b" },
  courseBadgeBox: { display: "flex", alignItems: "center", gap: "12px", background: "#f0fdf4", border: "1px solid #99f6e4", padding: "12px 16px", borderRadius: "10px", marginBottom: "18px" },
  courseBadgeLabel: { display: "block", fontSize: "11px", fontWeight: "700", color: "#0f766e", textTransform: "uppercase", letterSpacing: "0.5px" },
  courseBadgeTitle: { fontSize: "14px", fontWeight: "700", color: "#134e4a" },
  form: { display: "flex", flexDirection: "column", gap: "14px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "4px", display: "block" },
  input: { width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" },
  starRow: { display: "flex", alignItems: "center", gap: "6px" },
  ratingVal: { fontSize: "14px", fontWeight: "bold", color: "#475569", marginLeft: "10px" },
  textarea: { width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box", fontFamily: "inherit" },
  submitBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px", background: "#14b8a6", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  historyCard: { background: "#fff", padding: "24px", borderRadius: "14px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
  historyList: { display: "flex", flexDirection: "column", gap: "14px" },
  itemBox: { background: "#f8fafc", padding: "15px", borderRadius: "10px", borderLeft: "3px solid #14b8a6" },
  itemHeader: { display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#1e293b" },
  dateText: { fontSize: "12px", color: "#94a3b8" },
  facultyText: { fontSize: "13px", color: "#64748b", margin: "4px 0" },
  starsRender: { display: "flex", gap: "3px", margin: "6px 0" },
  commentText: { fontSize: "13px", color: "#334155", margin: 0, fontStyle: "italic" },
  empty: { color: "#94a3b8", textAlign: "center", padding: "30px" },
};