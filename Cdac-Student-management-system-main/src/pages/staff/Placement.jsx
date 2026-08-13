import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { getPlacements, addPlacement, deletePlacement } from "../../services/api";
import { getStorageData, saveStorageData } from "../../services/mockData";
import { Briefcase, Plus, MapPin, Calendar, Trash2 } from "lucide-react";

export default function Placement() {
  const [drives, setDrives] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    company: "",
    role: "",
    package: "",
    location: "Pune",
    eligibility: "DAC / DESD min 60%",
    date: new Date().toISOString().split("T")[0],
    status: "Active",
  });

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    try {
      const res = await getPlacements();
      if (res.data && res.data.length > 0) {
        setDrives(res.data);
      } else {
        setDrives(getStorageData("placements") || []);
      }
    } catch {
      setDrives(getStorageData("placements") || []);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.company || !form.role || !form.package) {
      return alert("Please fill company, role, and package details.");
    }

    try {
      await addPlacement({
        companyName: form.company,
        role: form.role,
        packageOffered: form.package,
        eligibility: form.eligibility,
        driveDate: form.date,
        status: form.status,
      });
      fetchPlacements();
    } catch (err) {
      console.log("Using storage fallback for placements:", err);
    }

    const newDrive = {
      ...form,
      id: Date.now(),
    };

    const updated = [newDrive, ...drives];
    setDrives(updated);
    saveStorageData("placements", updated);
    setForm({
      company: "",
      role: "",
      package: "",
      location: "Pune",
      eligibility: "DAC / DESD min 60%",
      date: new Date().toISOString().split("T")[0],
      status: "Active",
    });
    setShowModal(false);
    alert("Placement drive added successfully!");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this placement drive?")) {
      try {
        await deletePlacement(id);
      } catch {
        // storage fallback
      }
      const updated = drives.filter((d) => d.id !== id);
      setDrives(updated);
      saveStorageData("placements", updated);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>
              <Briefcase size={28} style={{ marginRight: "10px", color: "#8b5cf6" }} />
              Placement Drives Management
            </h1>
            <p style={styles.subtitle}>Post campus recruitment drives and manage company drives</p>
          </div>

          <button style={styles.addBtn} onClick={() => setShowModal(true)}>
            <Plus size={18} /> Post New Drive
          </button>
        </div>

        {/* DRIVE CARDS GRID */}
        <div style={styles.grid}>
          {drives.length === 0 ? (
            <p style={styles.empty}>No placement drives posted yet.</p>
          ) : (
            drives.map((item) => (
              <div key={item.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.company}>{item.company}</h3>
                  <span style={getStatusBadge(item.status)}>{item.status}</span>
                </div>

                <div style={styles.roleText}>{item.role}</div>

                <div style={styles.pkgBox}>
                  <span style={styles.pkgLabel}>Package:</span>
                  <span style={styles.pkgVal}>{item.package}</span>
                </div>

                <div style={styles.infoRow}>
                  <MapPin size={15} color="#64748b" />
                  <span>{item.location}</span>
                </div>

                <div style={styles.infoRow}>
                  <Calendar size={15} color="#64748b" />
                  <span>Drive Date: {item.date}</span>
                </div>

                <div style={styles.eligibility}>
                  <strong>Eligibility:</strong> {item.eligibility}
                </div>

                <div style={styles.cardFooter}>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(item.id)}>
                    <Trash2 size={15} /> Remove Drive
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Post Campus Recruitment Drive</h2>
            <form onSubmit={handleSave} style={styles.form}>
              <input
                style={styles.input}
                placeholder="Company Name (e.g. TCS Innovation Labs)"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                required
              />

              <input
                style={styles.input}
                placeholder="Job Role (e.g. Software Engineer)"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
              />

              <input
                style={styles.input}
                placeholder="Package LPA (e.g. ₹ 7.5 LPA)"
                value={form.package}
                onChange={(e) => setForm({ ...form, package: e.target.value })}
                required
              />

              <input
                style={styles.input}
                placeholder="Job Location (e.g. Pune / Bangalore)"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />

              <input
                style={styles.input}
                placeholder="Eligibility Criteria (e.g. DAC min 60%)"
                value={form.eligibility}
                onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
                required
              />

              <input
                type="date"
                style={styles.input}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />

              <div style={styles.modalBtns}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" style={styles.saveBtn}>
                  Post Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px" },
  title: { fontSize: "24px", color: "#1e293b", margin: 0, display: "flex", alignItems: "center" },
  subtitle: { color: "#64748b", margin: "5px 0 0 0", fontSize: "14px" },
  addBtn: { display: "flex", alignItems: "center", gap: "8px", background: "#8b5cf6", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" },
  card: { background: "#fff", padding: "20px", borderRadius: "14px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  company: { margin: 0, fontSize: "18px", color: "#1e293b" },
  roleText: { color: "#6366f1", fontWeight: "600", fontSize: "15px", marginBottom: "14px" },
  pkgBox: { background: "#f1f5f9", padding: "10px", borderRadius: "8px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  pkgLabel: { fontSize: "13px", color: "#64748b" },
  pkgVal: { fontSize: "15px", fontWeight: "bold", color: "#10b981" },
  infoRow: { display: "flex", alignItems: "center", gap: "8px", color: "#475569", fontSize: "13px", marginBottom: "8px" },
  eligibility: { marginTop: "6px", fontSize: "13px", color: "#64748b", background: "#faf5ff", padding: "8px", borderRadius: "6px", border: "1px solid #f3e8ff" },
  cardFooter: { marginTop: "15px", borderTop: "1px solid #f1f5f9", paddingTop: "12px", display: "flex", justifyContent: "flex-end" },
  deleteBtn: { display: "inline-flex", alignItems: "center", gap: "6px", background: "#fee2e2", color: "#b91c1c", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  empty: { color: "#94a3b8", textAlign: "center", gridColumn: "1 / -1", padding: "30px" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modal: { background: "#fff", width: "450px", padding: "25px", borderRadius: "14px", boxShadow: "0 10px 25px rgba(0,0,0,0.15)" },
  modalTitle: { margin: "0 0 15px 0", fontSize: "18px", color: "#1e293b" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: { padding: "11px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" },
  modalBtns: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" },
  cancelBtn: { padding: "9px 16px", background: "#e2e8f0", border: "none", borderRadius: "8px", cursor: "pointer" },
  saveBtn: { padding: "9px 16px", background: "#8b5cf6", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
};