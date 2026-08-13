import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { getNotices } from "../../services/api";
import { getStorageData } from "../../services/mockData";
import { Bell, Tag, Calendar, Clock, AlertCircle, Search } from "lucide-react";

export default function Notifications() {
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState("All");
  const [eventDateFilter, setEventDateFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await getNotices();
      if (res.data && res.data.length > 0) {
        const formatted = res.data.map((n) => ({
          ...n,
          message: n.content || n.message,
          priority: n.priority || "Medium",
          date: n.date || new Date().toISOString().split("T")[0],
          eventDate: n.eventDate || n.date || new Date().toISOString().split("T")[0],
        }));
        setList(formatted);
      } else {
        setList(getStorageData("notifications") || []);
      }
    } catch {
      setList(getStorageData("notifications") || []);
    }
  };

  const filteredList = list.filter((item) => {
    const matchesCategory = filter === "All" || item.category === filter;
    const matchesEventDate = !eventDateFilter || (item.eventDate || item.date) === eventDateFilter;
    
    const searchLower = (search || "").toLowerCase();
    const titleLower = String(item?.title || "").toLowerCase();
    const msgLower = String(item?.message || item?.content || "").toLowerCase();
    const matchesSearch = !searchLower || titleLower.includes(searchLower) || msgLower.includes(searchLower);

    return matchesCategory && matchesEventDate && matchesSearch;
  });

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container} className="animate-fade-in">
        <div style={styles.header}>
          <h1 style={styles.title}>
            <Bell size={28} style={{ marginRight: "10px", color: "#ec4899" }} />
            Notice Board & Scheduled Events
          </h1>
          <p style={styles.subtitle}>Official institute updates, exam schedules, and planned event dates</p>
        </div>

        {/* CONTROLS BAR: CATEGORY & EVENT DATE SELECTION */}
        <div style={styles.controlsCard}>
          <div style={styles.filterRow}>
            {["All", "Exam", "Placement", "Event", "General"].map((cat) => (
              <button
                key={cat}
                style={{
                  ...styles.filterBtn,
                  ...(filter === cat ? styles.filterActive : {}),
                }}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={styles.filterGroupRight}>
            <div style={styles.searchBox}>
              <Search size={15} color="#64748b" />
              <input
                style={styles.searchInput}
                placeholder="Search notice title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* FEED LIST */}
        <div style={styles.feedList}>
          {filteredList.length === 0 ? (
            <div style={styles.empty}>
              <AlertCircle size={32} color="#94a3b8" />
              <p style={{ marginTop: "10px" }}>No notifications found {eventDateFilter ? `for planned event date ${eventDateFilter}` : "under this category"}.</p>
            </div>
          ) : (
            filteredList.map((item) => (
              <div key={item.id} style={styles.noticeCard}>
                <div style={styles.cardHeader}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={styles.catBadge}>
                      <Tag size={12} /> {item.category || "General"}
                    </span>
                    <span style={getPriorityBadge(item.priority)}>
                      {item.priority || "Medium"} Priority
                    </span>
                  </div>
                  <span style={styles.dateText}>
                    <Clock size={13} color="#94a3b8" /> Posted: {item.date}
                  </span>
                </div>

                <h3 style={styles.noticeTitle}>{item.title}</h3>
                <p style={styles.noticeMsg}>{item.message}</p>

                {/* PLANNED EVENT DATE BADGE CALLOUT */}
                <div style={styles.eventCallout}>
                  <Calendar size={16} color="#be185d" />
                  <span>
                    <strong>Planned Event Date:</strong> {item.eventDate || item.date || "Scheduled"}
                  </span>
                </div>
              </div>
            ))
          )}
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
  container: { padding: "30px", maxWidth: "960px", margin: "0 auto" },
  header: { marginBottom: "25px" },
  title: { fontSize: "24px", color: "#1e293b", margin: 0, display: "flex", alignItems: "center", fontWeight: "800" },
  subtitle: { color: "#64748b", margin: "5px 0 0 0", fontSize: "14px" },
  controlsCard: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px", marginBottom: "25px" },
  filterRow: { display: "flex", gap: "8px", flexWrap: "wrap" },
  filterBtn: { padding: "8px 16px", borderRadius: "20px", border: "1px solid #cbd5e1", background: "#fff", color: "#475569", fontWeight: "600", fontSize: "13px", cursor: "pointer" },
  filterActive: { background: "#ec4899", color: "#fff", borderColor: "#ec4899" },
  filterGroupRight: { display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" },
  searchBox: { display: "flex", alignItems: "center", gap: "6px", background: "#fff", padding: "7px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" },
  searchInput: { border: "none", outline: "none", fontSize: "13px" },
  datePickerBox: { display: "flex", alignItems: "center", gap: "6px", background: "#fff", padding: "7px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" },
  dateInput: { border: "none", outline: "none", fontSize: "13px", background: "transparent", cursor: "pointer", color: "#334155" },
  clearDateBtn: { background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: "4px", padding: "2px 6px", fontSize: "11px", fontWeight: "700", cursor: "pointer" },
  feedList: { display: "flex", flexDirection: "column", gap: "16px" },
  noticeCard: { background: "#fff", padding: "22px", borderRadius: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderLeft: "5px solid #ec4899" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
  catBadge: { display: "inline-flex", alignItems: "center", gap: "4px", background: "#fce7f3", color: "#be185d", padding: "3px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: "bold" },
  dateText: { display: "inline-flex", alignItems: "center", gap: "4px", color: "#94a3b8", fontSize: "12px" },
  noticeTitle: { margin: "0 0 8px 0", color: "#1e293b", fontSize: "18px", fontWeight: "700" },
  noticeMsg: { color: "#475569", fontSize: "14px", lineHeight: "1.6", margin: "0 0 14px 0" },
  eventCallout: { display: "flex", alignItems: "center", gap: "8px", background: "#fce7f3", color: "#be185d", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" },
  empty: { background: "#fff", padding: "40px", borderRadius: "14px", textAlign: "center", color: "#64748b" },
};