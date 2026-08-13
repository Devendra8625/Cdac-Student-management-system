import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getPlacements } from "../../services/api";
import { getStorageData } from "../../services/mockData";
import { Briefcase, MapPin, Calendar, Search, CheckCircle } from "lucide-react";

export default function Placement() {
  const [drives, setDrives] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    try {
      const res = await getPlacements();
      if (res.data && res.data.length > 0) {
        const formatted = res.data.map((d) => ({
          ...d,
          company: d.companyName,
          package: d.packageOffered,
          location: d.location || "Pune",
          date: d.driveDate,
        }));
        setDrives(formatted);
      } else {
        setDrives(getStorageData("placements") || []);
      }
    } catch {
      setDrives(getStorageData("placements") || []);
    }
  };

  const handleApply = (jobId, company) => {
    setAppliedJobs((prev) => ({ ...prev, [jobId]: true }));
    alert(`Applied successfully for ${company}! 🚀`);
  };

  const filteredDrives = drives.filter((job) => {
    const searchLower = (search || "").toLowerCase();
    const comp = String(job?.company || "").toLowerCase();
    const rle = String(job?.role || "").toLowerCase();
    return comp.includes(searchLower) || rle.includes(searchLower);
  });

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>
              <Briefcase size={28} style={{ marginRight: "10px", color: "#8b5cf6" }} />
              Placement Opportunities
            </h1>
            <p style={styles.subtitle}>Explore active campus recruitment drives and apply for roles</p>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div style={styles.searchBox}>
          <Search size={18} color="#64748b" />
          <input
            style={styles.searchInput}
            placeholder="Search by company or job role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* GRID */}
        <div style={styles.grid}>
          {filteredDrives.length === 0 ? (
            <p style={styles.empty}>No placement drives match your search.</p>
          ) : (
            filteredDrives.map((job) => {
              const isApplied = !!appliedJobs[job.id];
              return (
                <div key={job.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.company}>{job.company}</h3>
                    <span style={getStatusBadge(job.status)}>{job.status}</span>
                  </div>

                  <div style={styles.roleText}>{job.role}</div>

                  <div style={styles.pkgBox}>
                    <span style={styles.pkgLabel}>Salary Package:</span>
                    <span style={styles.pkgVal}>{job.package}</span>
                  </div>

                  <div style={styles.infoRow}>
                    <MapPin size={15} color="#64748b" />
                    <span>{job.location}</span>
                  </div>

                  <div style={styles.infoRow}>
                    <Calendar size={15} color="#64748b" />
                    <span>Drive Date: {job.date}</span>
                  </div>

                  <div style={styles.eligibility}>
                    <strong>Eligibility:</strong> {job.eligibility}
                  </div>

                  {isApplied ? (
                    <button style={styles.appliedBtn} disabled>
                      <CheckCircle size={16} /> Applied
                    </button>
                  ) : (
                    <button
                      style={styles.applyBtn}
                      onClick={() => handleApply(job.id, job.company)}
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

const getStatusBadge = (s) => {
  let bg = "#dcfce7";
  let color = "#166534";
  if (s === "Upcoming") { bg = "#fef3c7"; color = "#b45309"; }

  return {
    padding: "3px 10px",
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
  headerRow: { marginBottom: "25px" },
  title: { fontSize: "24px", color: "#1e293b", margin: 0, display: "flex", alignItems: "center" },
  subtitle: { color: "#64748b", margin: "5px 0 0 0", fontSize: "14px" },
  searchBox: { display: "flex", alignItems: "center", gap: "10px", background: "#fff", padding: "12px 16px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.04)", marginBottom: "25px" },
  searchInput: { border: "none", outline: "none", width: "100%", fontSize: "14px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" },
  card: { background: "#fff", padding: "20px", borderRadius: "14px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  company: { margin: 0, fontSize: "18px", color: "#1e293b" },
  roleText: { color: "#6366f1", fontWeight: "600", fontSize: "15px", marginBottom: "14px" },
  pkgBox: { background: "#f1f5f9", padding: "10px", borderRadius: "8px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  pkgLabel: { fontSize: "13px", color: "#64748b" },
  pkgVal: { fontSize: "15px", fontWeight: "bold", color: "#10b981" },
  infoRow: { display: "flex", alignItems: "center", gap: "8px", color: "#475569", fontSize: "13px", marginBottom: "8px" },
  eligibility: { marginTop: "6px", fontSize: "13px", color: "#64748b", background: "#faf5ff", padding: "8px", borderRadius: "6px", border: "1px solid #f3e8ff", marginBottom: "15px" },
  applyBtn: { padding: "11px", background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", marginTop: "auto" },
  appliedBtn: { padding: "11px", background: "#dcfce7", color: "#15803d", border: "none", borderRadius: "8px", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", marginTop: "auto" },
  empty: { color: "#94a3b8", textAlign: "center", gridColumn: "1 / -1", padding: "30px" },
};