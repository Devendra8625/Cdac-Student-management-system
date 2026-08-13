import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getMarks, getAttendance, getStudentByEmail } from "../../services/api";
import { getStorageData } from "../../services/mockData";
import {
  User,
  BookOpen,
  Award,
  ClipboardList,
  Briefcase,
  FileText,
  Bell,
  MessageSquare,
  ArrowRight,
  Sparkles,
  TrendingUp,
  BookCheck,
} from "lucide-react";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [dynamicMetrics, setDynamicMetrics] = useState({
    performancePct: "0.0%",
    attendancePct: "100.0%",
    modulesCleared: "0 Modules",
    studentName: user?.name || "Student",
  });

  useEffect(() => {
    fetchDashboardDynamicStats();
  }, [user]);

  const fetchDashboardDynamicStats = async () => {
    let name = user?.name || "Student";
    let marksData = [];
    let attendanceData = [];

    // 1. Fetch Student Profile Name
    try {
      if (user?.email) {
        const pRes = await getStudentByEmail(user.email);
        if (pRes && pRes.data && pRes.data.name) {
          name = pRes.data.name;
        }
      }
    } catch (err) {
      console.log("Profile fetch fallback:", err);
    }

    // 2. Fetch Dynamic Marks
    try {
      const mRes = await getMarks();
      if (mRes && mRes.data && mRes.data.length > 0) {
        marksData = mRes.data;
      } else {
        marksData = getStorageData("marks") || [];
      }
    } catch {
      marksData = getStorageData("marks") || [];
    }

    // 3. Fetch Dynamic Attendance
    try {
      const aRes = await getAttendance();
      if (aRes && aRes.data && aRes.data.length > 0) {
        attendanceData = aRes.data;
      } else {
        attendanceData = getStorageData("attendance") || [];
      }
    } catch {
      attendanceData = getStorageData("attendance") || [];
    }

    // Calculate Dynamic Metrics
    const totalScore = marksData.reduce((sum, m) => sum + (Number(m.score || m.marksObtained) || 0), 0);
    const totalMax = marksData.reduce((sum, m) => sum + (Number(m.maxScore || m.maxMarks) || 100), 0);
    const overallPct = totalMax > 0 ? ((totalScore / totalMax) * 100).toFixed(1) : "0.0";

    const passedModulesCount = marksData.filter((m) => {
      const score = Number(m.score || m.marksObtained || 0);
      const max = Number(m.maxScore || m.maxMarks || 100);
      return max > 0 && (score / max) >= 0.5;
    }).length;

    let totalPresent = 0;
    let totalClasses = 0;
    attendanceData.forEach((a) => {
      totalPresent += Number(a.presentCount || 0);
      totalClasses += Number(a.totalStudents || 0);
    });
    const attendancePctVal = totalClasses > 0 ? ((totalPresent / totalClasses) * 100).toFixed(1) : "92.0";

    setDynamicMetrics({
      performancePct: `${overallPct}%`,
      attendancePct: `${attendancePctVal}% (${Number(attendancePctVal) >= 75 ? "Eligible" : "Needs Attention"})`,
      modulesCleared: `${passedModulesCount} / ${marksData.length || 0} Modules`,
      studentName: name,
    });
  };

  const modules = [
    { name: "My Profile", desc: "View & manage student details & course batch", icon: <User size={24} />, path: "/student/profile", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)" },
    { name: "Examination Marks", desc: "View module exam scores & percentages", icon: <BookOpen size={24} />, path: "/student/marks", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
    { name: "Attendance", desc: "Track lecture attendance & exam eligibility", icon: <ClipboardList size={24} />, path: "/student/attendance", color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" },
    { name: "Placement Drives", desc: "Explore campus drives & apply for roles", icon: <Briefcase size={24} />, path: "/student/placement", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.1)" },
    { name: "Assignments", desc: "View & submit course lab assignments", icon: <FileText size={24} />, path: "/student/assignments", color: "#06b6d4", bg: "rgba(6, 182, 212, 0.1)" },
    { name: "Notice Board", desc: "Read latest announcements & exam alerts", icon: <Bell size={24} />, path: "/student/notifications", color: "#ec4899", bg: "rgba(236, 72, 153, 0.1)" },
    { name: "Give Feedback", desc: "Provide course & faculty feedback ratings", icon: <MessageSquare size={24} />, path: "/student/feedback", color: "#14b8a6", bg: "rgba(20, 184, 166, 0.1)" }
  ];

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container} className="animate-fade-in">
        {/* HERO BANNER */}
        <div style={styles.heroBanner}>
          <div style={styles.heroContent}>
            <span style={styles.roleBadge}>
              <Sparkles size={14} /> STUDENT PORTAL
            </span>
            <h1 style={styles.heading}>
              Welcome back, <span style={styles.name}>{dynamicMetrics.studentName}</span> 👋
            </h1>
            <p style={styles.subHeading}>
              Track your academic progress, check module marks, view attendance, and apply for campus placements.
            </p>
          </div>
        </div>

        {/* METRICS SUMMARY */}
        <div style={styles.metricsGrid}>
          <div style={styles.metricCard}>
            <div style={{ ...styles.metricIconBg, background: "rgba(16, 185, 129, 0.1)" }}>
              <Award size={20} color="#10b981" />
            </div>
            <div>
              <span style={styles.metricLabel}>Academic Score</span>
              <h3 style={{ ...styles.metricVal, color: "#10b981" }}>{dynamicMetrics.performancePct}</h3>
            </div>
          </div>

          <div style={styles.metricCard}>
            <div style={{ ...styles.metricIconBg, background: "rgba(99, 102, 241, 0.1)" }}>
              <TrendingUp size={20} color="#6366f1" />
            </div>
            <div>
              <span style={styles.metricLabel}>Attendance Standing</span>
              <h3 style={{ ...styles.metricVal, color: "#6366f1" }}>{dynamicMetrics.attendancePct}</h3>
            </div>
          </div>

          <div style={styles.metricCard}>
            <div style={{ ...styles.metricIconBg, background: "rgba(139, 92, 246, 0.1)" }}>
              <BookCheck size={20} color="#8b5cf6" />
            </div>
            <div>
              <span style={styles.metricLabel}>Modules Cleared</span>
              <h3 style={{ ...styles.metricVal, color: "#8b5cf6" }}>{dynamicMetrics.modulesCleared}</h3>
            </div>
          </div>
        </div>

        {/* MODULES GRID */}
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Student Modules</h2>
        </div>

        <div style={styles.grid}>
          {modules.map((item, index) => (
            <div
              key={index}
              style={styles.card}
              onClick={() => navigate(item.path)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 12px 25px rgba(0, 0, 0, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.05)";
              }}
            >
              <div style={styles.cardTop}>
                <div style={{ ...styles.iconBox, background: item.bg, color: item.color }}>
                  {item.icon}
                </div>
                <ArrowRight size={18} color="#94a3b8" />
              </div>
              <h3 style={styles.cardTitle}>{item.name}</h3>
              <p style={styles.cardText}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f8fafc" },
  container: { padding: "30px", maxWidth: "1280px", margin: "0 auto" },
  heroBanner: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
    borderRadius: "20px",
    padding: "35px 40px",
    color: "#fff",
    marginBottom: "30px",
    boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.25)",
  },
  heroContent: { maxWidth: "700px" },
  roleBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(99, 102, 241, 0.25)",
    border: "1px solid rgba(99, 102, 241, 0.4)",
    color: "#818cf8",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
    marginBottom: "12px",
  },
  heading: { fontSize: "28px", fontWeight: "800", margin: "0 0 8px 0" },
  name: { color: "#818cf8" },
  subHeading: { color: "#94a3b8", fontSize: "15px", lineHeight: "1.6" },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
    marginBottom: "35px",
  },
  metricCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.05)",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  metricIconBg: {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  metricLabel: { fontSize: "13px", color: "#64748b", fontWeight: "500" },
  metricVal: { fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: "2px 0 0 0" },
  sectionHeader: { marginBottom: "20px" },
  sectionTitle: { fontSize: "20px", fontWeight: "700", color: "#0f172a" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
    gap: "22px",
  },
  card: {
    background: "#fff",
    padding: "24px",
    borderRadius: "18px",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    flexDirection: "column",
  },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  iconBox: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontSize: "18px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" },
  cardText: { fontSize: "14px", color: "#64748b", lineHeight: "1.5" },
};