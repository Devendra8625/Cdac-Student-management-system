import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { getStudentByEmail, updateStudentByEmail } from "../../services/api";
import { COURSES_DATA } from "../../services/coursesData";
import { User, Mail, BookOpen, Award, ShieldCheck, Edit3, AlertTriangle, Phone, MapPin, CheckCircle2 } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    course: "",
    rollNo: "",
    prnNo: "",
    phone: "",
    address: "",
    batch: "",
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const userEmail = user?.email || "student@cdac.in";
      const res = await getStudentByEmail(userEmail);
      if (res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const userEmail = user?.email || profile.email;
      await updateStudentByEmail(userEmail, tempProfile);
      setProfile({ ...profile, ...tempProfile });
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  // Check if profile is incomplete
  const isIncomplete = !profile.prnNo || !profile.phone || !profile.address;

  if (loading) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={{ ...styles.container, textAlign: "center", paddingTop: "80px" }}>
          <p style={{ color: "#64748b", fontSize: "16px" }}>Loading your profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>My Academic Profile</h1>
          <p style={styles.subtitle}>View and manage your official C-DAC student registration details</p>
        </div>

        {/* INCOMPLETE PROFILE ALERT BANNER */}
        {isIncomplete && (
          <div style={styles.alertBanner} className="animate-fade-in">
            <div style={styles.alertIcon}>
              <AlertTriangle size={24} color="#dc2626" />
            </div>
            <div style={styles.alertText}>
              <h3 style={styles.alertTitle}>Profile Incomplete!</h3>
              <p style={styles.alertDesc}>
                Your profile is missing key details (PRN Number, Phone, or Address). Please complete your profile to enable all academic services.
              </p>
            </div>
            <button
              style={styles.completeBtn}
              onClick={() => {
                setTempProfile(profile);
                setIsEditing(true);
              }}
            >
              Complete Profile Now
            </button>
          </div>
        )}

        {saveSuccess && (
          <div style={styles.successBanner}>
            <CheckCircle2 size={20} color="#16a34a" />
            <span>Profile successfully updated in database!</span>
          </div>
        )}

        <div style={styles.profileCard}>
          <div style={styles.topBanner}>
            <div style={styles.avatar}>
              {(profile.name || user?.name || "S").charAt(0).toUpperCase()}
            </div>
            <div style={styles.topInfo}>
              <h2 style={styles.name}>{profile.name || user?.name || "C-DAC Student"}</h2>
              <span style={styles.badge}>{profile.course || "DAC"} Student</span>
              <p style={styles.center}>C-DAC Advanced Computing Training School</p>
            </div>
            <button
              style={styles.editBtn}
              onClick={() => {
                setTempProfile(profile);
                setIsEditing(true);
              }}
            >
              <Edit3 size={16} /> Edit Profile
            </button>
          </div>

          <div style={styles.divider} />

          <div style={styles.detailsGrid}>
            <div style={styles.detailItem}>
              <Award size={20} color="#6366f1" />
              <div>
                <span style={styles.label}>Roll Number</span>
                <span style={styles.val}>{profile.rollNo || "Not Assigned"}</span>
              </div>
            </div>

            <div style={styles.detailItem}>
              <ShieldCheck size={20} color="#6366f1" />
              <div>
                <span style={styles.label}>PRN Number</span>
                <span style={{ ...styles.val, color: profile.prnNo ? "#1e293b" : "#dc2626" }}>
                  {profile.prnNo || "Not Provided (Incomplete)"}
                </span>
              </div>
            </div>

            <div style={styles.detailItem}>
              <Mail size={20} color="#6366f1" />
              <div>
                <span style={styles.label}>Email Address</span>
                <span style={styles.val}>{profile.email || user?.email}</span>
              </div>
            </div>

            <div style={styles.detailItem}>
              <BookOpen size={20} color="#6366f1" />
              <div>
                <span style={styles.label}>Course Program</span>
                <span style={styles.val}>{profile.course || "DAC"}</span>
              </div>
            </div>

            <div style={styles.detailItem}>
              <Phone size={20} color="#6366f1" />
              <div>
                <span style={styles.label}>Phone Number</span>
                <span style={{ ...styles.val, color: profile.phone ? "#1e293b" : "#dc2626" }}>
                  {profile.phone || "Not Provided (Incomplete)"}
                </span>
              </div>
            </div>

            <div style={styles.detailItem}>
              <MapPin size={20} color="#6366f1" />
              <div>
                <span style={styles.label}>Permanent Address</span>
                <span style={{ ...styles.val, color: profile.address ? "#1e293b" : "#dc2626" }}>
                  {profile.address || "Not Provided (Incomplete)"}
                </span>
              </div>
            </div>

            <div style={styles.detailItem}>
              <User size={20} color="#6366f1" />
              <div>
                <span style={styles.label}>Batch</span>
                <span style={styles.val}>{profile.batch || "February 2026"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Complete / Edit Academic Profile</h2>
            <form onSubmit={handleSave} style={styles.form}>
              <div>
                <label style={styles.formLabel}>Full Name</label>
                <input
                  style={styles.input}
                  value={tempProfile.name || ""}
                  onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={styles.formLabel}>Course</label>
                <select
                  style={styles.input}
                  value={tempProfile.course || "PGCP-AC"}
                  onChange={(e) => setTempProfile({ ...tempProfile, course: e.target.value })}
                >
                  {COURSES_DATA.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.fullTitle}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={styles.formLabel}>PRN Number</label>
                <input
                  style={styles.input}
                  placeholder="e.g. 260340120001"
                  value={tempProfile.prnNo || ""}
                  onChange={(e) => setTempProfile({ ...tempProfile, prnNo: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={styles.formLabel}>Phone Number</label>
                <input
                  style={styles.input}
                  placeholder="e.g. +91 9876543210"
                  value={tempProfile.phone || ""}
                  onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={styles.formLabel}>Permanent Address</label>
                <input
                  style={styles.input}
                  placeholder="e.g. Pune, Maharashtra"
                  value={tempProfile.address || ""}
                  onChange={(e) => setTempProfile({ ...tempProfile, address: e.target.value })}
                  required
                />
              </div>

              <div style={styles.modalBtns}>
                <button type="button" style={styles.cancelBtn} onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="submit" style={styles.saveBtn}>
                  Save Profile to Database
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
  container: { padding: "30px", maxWidth: "1000px", margin: "0 auto" },
  header: { marginBottom: "25px" },
  title: { fontSize: "24px", color: "#1e293b", margin: 0, fontWeight: "700" },
  subtitle: { color: "#64748b", margin: "5px 0 0 0", fontSize: "14px" },
  alertBanner: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    padding: "18px 24px",
    borderRadius: "14px",
    marginBottom: "25px",
    boxShadow: "0 4px 12px rgba(220, 38, 38, 0.08)",
  },
  alertIcon: { background: "#fee2e2", padding: "10px", borderRadius: "10px" },
  alertText: { flex: 1 },
  alertTitle: { margin: 0, color: "#991b1b", fontSize: "16px", fontWeight: "700" },
  alertDesc: { margin: "4px 0 0 0", color: "#7f1d1d", fontSize: "13px" },
  completeBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  successBanner: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#166534",
    padding: "12px 18px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "14px",
  },
  profileCard: { background: "#fff", borderRadius: "16px", padding: "30px", boxShadow: "0 4px 14px rgba(0,0,0,0.06)", marginBottom: "25px" },
  topBanner: { display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" },
  avatar: { width: "70px", height: "70px", borderRadius: "50%", background: "#6366f1", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "28px", fontWeight: "bold" },
  topInfo: { flex: 1 },
  name: { margin: "0 0 5px 0", color: "#1e293b", fontSize: "22px", fontWeight: "700" },
  badge: { display: "inline-block", background: "#e0e7ff", color: "#4338ca", padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" },
  center: { color: "#64748b", fontSize: "14px", marginTop: "4px", margin: 0 },
  editBtn: { display: "flex", alignItems: "center", gap: "8px", background: "#f1f5f9", color: "#334155", border: "none", padding: "9px 16px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  divider: { height: "1px", background: "#f1f5f9", margin: "25px 0" },
  detailsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" },
  detailItem: { display: "flex", alignItems: "center", gap: "12px" },
  label: { display: "block", fontSize: "12px", color: "#64748b" },
  val: { display: "block", fontSize: "15px", fontWeight: "600", color: "#1e293b", marginTop: "2px" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modal: { background: "#fff", width: "450px", padding: "28px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" },
  modalTitle: { margin: "0 0 18px 0", fontSize: "18px", color: "#1e293b", fontWeight: "700" },
  form: { display: "flex", flexDirection: "column", gap: "14px" },
  formLabel: { fontSize: "13px", color: "#475569", fontWeight: "600", marginBottom: "4px", display: "block" },
  input: { padding: "11px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", width: "100%", boxSizing: "border-box" },
  modalBtns: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" },
  cancelBtn: { padding: "10px 18px", background: "#e2e8f0", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  saveBtn: { padding: "10px 18px", background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
};