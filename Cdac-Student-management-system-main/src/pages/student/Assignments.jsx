import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { getAssignments, updateAssignment } from "../../services/api";
import { getStorageData, saveStorageData } from "../../services/mockData";
import { FileText, Calendar, CheckCircle2, Clock, UploadCloud } from "lucide-react";

export default function Assignments() {
  const [list, setList] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [submissionText, setSubmissionText] = useState("");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await getAssignments();
      if (res.data && res.data.length > 0) {
        setList(res.data);
      } else {
        setList(getStorageData("assignments") || []);
      }
    } catch {
      setList(getStorageData("assignments") || []);
    }
  };

  const handleOpenSubmitModal = (item) => {
    setActiveItem(item);
    setSubmissionText("");
  };

  const handleCompleteSubmission = async (e) => {
    e.preventDefault();
    if (!submissionText.trim()) {
      return alert("Please enter your solution or link.");
    }

    try {
      await updateAssignment(activeItem.id, { status: "Submitted" });
    } catch {
      // storage fallback
    }

    const updated = list.map((a) =>
      a.id === activeItem.id ? { ...a, status: "Submitted" } : a
    );
    setList(updated);
    saveStorageData("assignments", updated);
    setActiveItem(null);
    alert("Assignment submitted successfully!");
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            <FileText size={28} style={{ marginRight: "10px", color: "#06b6d4" }} />
            My Course Assignments
          </h1>
          <p style={styles.subtitle}>Track, complete, and submit course lab assignments</p>
        </div>

        {/* LIST */}
        <div style={styles.grid}>
          {list.length === 0 ? (
            <p style={styles.empty}>No active assignments available.</p>
          ) : (
            list.map((item) => (
              <div key={item.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.subjectBadge}>{item.subject}</span>
                  {item.status === "Submitted" ? (
                    <span style={styles.submittedBadge}>
                      <CheckCircle2 size={13} /> Submitted
                    </span>
                  ) : (
                    <span style={styles.pendingBadge}>
                      <Clock size={13} /> Pending
                    </span>
                  )}
                </div>

                <h3 style={styles.cardTitle}>{item.title}</h3>
                <p style={styles.desc}>{item.description}</p>

                <div style={styles.footer}>
                  <span style={styles.dateText}>
                    <Calendar size={14} /> Due: {item.dueDate}
                  </span>

                  {item.status !== "Submitted" ? (
                    <button
                      style={styles.submitBtn}
                      onClick={() => handleOpenSubmitModal(item)}
                    >
                      <UploadCloud size={15} /> Submit Solution
                    </button>
                  ) : (
                    <span style={styles.doneText}>Completed ✅</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL */}
      {activeItem && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Submit Solution: {activeItem.title}</h2>
            <form onSubmit={handleCompleteSubmission} style={styles.form}>
              <p style={styles.modalSub}>{activeItem.description}</p>

              <div>
                <label style={styles.label}>Your Solution / GitHub Repo URL / Answer</label>
                <textarea
                  style={styles.textarea}
                  rows={5}
                  placeholder="Paste GitHub code link or write assignment answer..."
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  required
                />
              </div>

              <div style={styles.modalBtns}>
                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={() => setActiveItem(null)}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.saveBtn}>
                  Confirm Submission
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
  container: { padding: "30px", maxWidth: "1100px", margin: "0 auto" },
  header: { marginBottom: "25px" },
  title: { fontSize: "24px", color: "#1e293b", margin: 0, display: "flex", alignItems: "center" },
  subtitle: { color: "#64748b", margin: "5px 0 0 0", fontSize: "14px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" },
  card: { background: "#fff", padding: "22px", borderRadius: "14px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
  subjectBadge: { background: "#e0f2fe", color: "#0369a1", padding: "4px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: "bold" },
  submittedBadge: { display: "inline-flex", alignItems: "center", gap: "4px", background: "#dcfce7", color: "#15803d", padding: "4px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: "bold" },
  pendingBadge: { display: "inline-flex", alignItems: "center", gap: "4px", background: "#fef3c7", color: "#b45309", padding: "4px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: "bold" },
  cardTitle: { margin: "0 0 10px 0", color: "#1e293b", fontSize: "17px" },
  desc: { color: "#475569", fontSize: "14px", lineHeight: "1.5", margin: "0 0 15px 0", flex: 1 },
  footer: { borderTop: "1px solid #f1f5f9", paddingTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  dateText: { display: "inline-flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "13px" },
  submitBtn: { display: "inline-flex", alignItems: "center", gap: "6px", background: "#06b6d4", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "13px" },
  doneText: { fontSize: "13px", fontWeight: "bold", color: "#10b981" },
  empty: { color: "#94a3b8", textAlign: "center", gridColumn: "1 / -1", padding: "30px" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modal: { background: "#fff", width: "480px", padding: "25px", borderRadius: "14px", boxShadow: "0 10px 25px rgba(0,0,0,0.15)" },
  modalTitle: { margin: "0 0 8px 0", fontSize: "18px", color: "#1e293b" },
  modalSub: { color: "#64748b", fontSize: "13px", marginBottom: "15px" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "4px", display: "block" },
  textarea: { width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box", fontFamily: "inherit" },
  modalBtns: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" },
  cancelBtn: { padding: "9px 16px", background: "#e2e8f0", border: "none", borderRadius: "8px", cursor: "pointer" },
  saveBtn: { padding: "9px 16px", background: "#06b6d4", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
};