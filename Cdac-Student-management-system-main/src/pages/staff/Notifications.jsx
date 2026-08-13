import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { getNotices, addNotice, deleteNotice } from "../../services/api";
import { getStorageData, saveStorageData } from "../../services/mockData";
import { Bell, Send, Trash2, Tag, Calendar, Clock, Search } from "lucide-react";

export default function Notifications() {
  const [list, setList] = useState([]);
  const [eventDateFilter, setEventDateFilter] = useState("");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "General",
    priority: "Medium",
    date: new Date().toISOString().split("T")[0],
    eventDate: new Date().toISOString().split("T")[0],
    message: "",
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await getNotices();
      if (res.data && res.data.length > 0) {
        setList(res.data);
      } else {
        setList(getStorageData("notifications") || []);
      }
    } catch {
      setList(getStorageData("notifications") || []);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      return alert("Please enter both title and announcement message.");
    }

    const noticePayload = {
      title: form.title.trim(),
      message: form.message.trim(),
      content: form.message.trim(),
      category: form.category,
      priority: form.priority,
      date: form.date || new Date().toISOString().split("T")[0],
      eventDate: form.eventDate || form.date || new Date().toISOString().split("T")[0],
      postedBy: "Faculty",
    };

    try {
      await addNotice(noticePayload);
    } catch (err) {
      console.log("Using local storage fallback for notices:", err);
    }

    const newNotice = {
      ...noticePayload,
      id: Date.now(),
    };

    const updated = [newNotice, ...list];
    setList(updated);
    saveStorageData("notifications", updated);
    setForm({
      title: "",
      category: "General",
      priority: "Medium",
      date: new Date().toISOString().split("T")[0],
      eventDate: new Date().toISOString().split("T")[0],
      message: "",
    });
    alert(`Announcement for event scheduled on ${noticePayload.eventDate} published successfully!`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this announcement?")) {
      try {
        await deleteNotice(id);
      } catch {
        // storage fallback
      }
      const updated = list.filter((n) => n.id !== id);
      setList(updated);
      saveStorageData("notifications", updated);
    }
  };

  // Filter list by event date and search query safely
  const filteredList = list.filter((item) => {
    const itemTitle = String(item?.title || "").toLowerCase();
    const itemMsg = String(item?.message || item?.content || "").toLowerCase();
    const itemCat = String(item?.category || "").toLowerCase();
    const searchLower = (search || "").toLowerCase();

    const matchesSearch =
      itemTitle.includes(searchLower) ||
      itemMsg.includes(searchLower) ||
      itemCat.includes(searchLower);

    const matchesEventDate = !eventDateFilter || (item?.eventDate || item?.date) === eventDateFilter;

    return matchesSearch && matchesEventDate;
  });

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container} className="animate-fade-in">
        <div style={styles.header}>
          <h1 style={styles.title}>
            <Bell size={28} style={{ marginRight: "10px", color: "#ec4899" }} />
            Post Announcements & Scheduled Events
          </h1>
          <p style={styles.subtitle}>Broadcast notices with planned event/exam dates for students</p>
        </div>

        <div style={styles.grid}>
          {/* CREATE FORM */}
          <div style={styles.formCard}>
            <h3 style={styles.cardTitle}>New Announcement & Scheduled Event</h3>
            <form onSubmit={handlePost} style={styles.form}>
              <div>
                <label style={styles.label}>Notice / Event Title *</label>
                <input
                  style={styles.input}
                  placeholder="e.g. C-DAC ACTS End-Module Exam"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              {/* PLANNED EVENT DATE & POSTING DATE */}
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label style={styles.labelHighlight}>
                    <Calendar size={14} style={{ verticalAlign: "middle", marginRight: "5px", color: "#ec4899" }} />
                    Planned Event Date *
                  </label>
                  <input
                    type="date"
                    style={{ ...styles.input, border: "2px solid #f472b6", background: "#fff" }}
                    value={form.eventDate}
                    onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                    required
                  />
                  <span style={styles.subtext}>Date when event/exam is planned to occur</span>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Posting Date</label>
                  <input
                    type="date"
                    style={styles.input}
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                  <span style={styles.subtext}>Publication date</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Category</label>
                  <select
                    style={styles.input}
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option>General</option>
                    <option>Exam</option>
                    <option>Placement</option>
                    <option>Event</option>
                    <option>Holiday</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Priority</label>
                  <select
                    style={styles.input}
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={styles.label}>Message / Event Details *</label>
                <textarea
                  style={styles.textarea}
                  rows={5}
                  placeholder="Write full details about the planned event, location, instructions, etc..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>

              <button type="submit" style={styles.submitBtn}>
                <Send size={16} /> Broadcast Scheduled Notice
              </button>
            </form>
          </div>

          {/* ANNOUNCEMENT FEED */}
          <div style={styles.feedSection}>
            <div style={styles.feedHeader}>
              <h3 style={styles.cardTitle}>Posted Notices ({filteredList.length})</h3>
            </div>

            {/* SEARCH FILTER */}
            <div style={styles.filterCard}>
              <div style={styles.searchBox}>
                <Search size={16} color="#64748b" />
                <input
                  style={styles.searchInput}
                  placeholder="Search notices..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div style={styles.feedList}>
              {filteredList.length === 0 ? (
                <p style={styles.empty}>
                  No notices found {eventDateFilter ? `for planned event date ${eventDateFilter}` : ""}.
                </p>
              ) : (
                filteredList.map((item) => (
                  <div key={item.id} style={styles.noticeCard}>
                    <div style={styles.noticeHeader}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                        <span style={styles.catBadge}>
                          <Tag size={12} /> {item.category || "General"}
                        </span>
                        <span style={getPriorityBadge(item.priority)}>
                          {item.priority || "Medium"} Priority
                        </span>
                      </div>
                      <button style={styles.deleteBtn} onClick={() => handleDelete(item.id)}>
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <h4 style={styles.noticeTitle}>{item.title}</h4>
                    <p style={styles.noticeMsg}>{item.message || item.content}</p>

                    {/* PLANNED EVENT DATE BADGE CALLOUT */}
                    <div style={styles.eventDateCallout}>
                      <Calendar size={15} color="#be185d" />
                      <span>
                        <strong>Planned Event Date:</strong> {item.eventDate || item.date || "Scheduled"}
                      </span>
                    </div>

                    <div style={styles.noticeFooter}>
                      <span style={styles.dateText}>
                        <Clock size={12} /> Posted on: {item.date || "Today"}
                      </span>
                    </div>
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

const getPriorityBadge = (p) => {
  let bg = "#f3f4f6";
  let color = "#4b5563";
  if (p === "High") { bg = "#fee2e2"; color = "#b91c1c"; }
  else if (p === "Medium") { bg = "#fef3c7"; color = "#b45309"; }

  return {
    padding: "3px 8px",
    borderRadius: "10px",
    fontSize: "11px",
    fontWeight: "bold",
    background: bg,
    color: color,
  };
};

const styles = {
  page: { minHeight: "100vh", background: "#f8fafc" },
  container: { padding: "30px", maxWidth: "1200px", margin: "0 auto" },
  header: { marginBottom: "25px" },
  title: { fontSize: "24px", color: "#1e293b", margin: 0, display: "flex", alignItems: "center", fontWeight: "800" },
  subtitle: { color: "#64748b", margin: "5px 0 0 0", fontSize: "14px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "25px", alignItems: "start" },
  formCard: { background: "#fff", padding: "24px", borderRadius: "14px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
  cardTitle: { margin: "0 0 18px 0", fontSize: "17px", color: "#1e293b", fontWeight: "700" },
  form: { display: "flex", flexDirection: "column", gap: "14px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "4px", display: "block" },
  labelHighlight: { fontSize: "13px", fontWeight: "700", color: "#be185d", marginBottom: "4px", display: "block" },
  subtext: { fontSize: "11px", color: "#94a3b8", display: "block", marginTop: "3px" },
  input: { width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box", background: "#f8fafc" },
  textarea: { width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box", fontFamily: "inherit", background: "#f8fafc" },
  submitBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px", background: "#ec4899", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 12px rgba(236, 72, 153, 0.25)" },
  feedSection: { display: "flex", flexDirection: "column" },
  feedHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  filterCard: { display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" },
  searchBox: { display: "flex", alignItems: "center", gap: "8px", background: "#fff", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", flex: 1, minWidth: "180px" },
  searchInput: { border: "none", outline: "none", width: "100%", fontSize: "13px" },
  dateFilterBox: { display: "flex", alignItems: "center", gap: "6px", background: "#fff", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" },
  dateInput: { border: "none", outline: "none", fontSize: "13px", background: "transparent", cursor: "pointer", color: "#334155" },
  clearDateBtn: { background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: "4px", padding: "3px 8px", fontSize: "11px", fontWeight: "700", cursor: "pointer" },
  feedList: { display: "flex", flexDirection: "column", gap: "15px" },
  noticeCard: { background: "#fff", padding: "20px", borderRadius: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderLeft: "5px solid #ec4899" },
  noticeHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  catBadge: { display: "inline-flex", alignItems: "center", gap: "4px", background: "#e0e7ff", color: "#4338ca", padding: "3px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: "bold" },
  deleteBtn: { background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "4px" },
  noticeTitle: { margin: "0 0 8px 0", color: "#1e293b", fontSize: "17px", fontWeight: "700" },
  noticeMsg: { color: "#475569", fontSize: "14px", lineHeight: "1.5", margin: "0 0 12px 0" },
  eventDateCallout: { display: "flex", alignItems: "center", gap: "8px", background: "#fce7f3", color: "#9d174d", padding: "8px 14px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", marginBottom: "10px" },
  noticeFooter: { borderTop: "1px solid #f1f5f9", paddingTop: "8px", display: "flex", justifyContent: "space-between" },
  dateText: { display: "inline-flex", alignItems: "center", gap: "4px", color: "#94a3b8", fontSize: "12px" },
  empty: { color: "#94a3b8", textAlign: "center", padding: "30px", background: "#fff", borderRadius: "12px" },
};