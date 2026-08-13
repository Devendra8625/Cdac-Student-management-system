import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getCourses, getStudents, getPlacements } from "../../services/api";
import {
  Users,
  BookOpen,
  Award,
  Briefcase,
  ClipboardList,
  Bell,
  Sparkles,
  TrendingUp,
  FileText,
  MessageSquare,
  Layers
} from "lucide-react";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const staffCourse = user?.course || "PGCP-AC";
  const [courses, setCourses] = useState([]);
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    activePlacements: 0,
  });

  const managementModules = [
    { name: "Students", desc: "Manage student profiles and course enrollments", icon: <Users size={24} />, path: "/staff/students", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)" },
    { name: "Marks", desc: "Upload and publish module exam scores", icon: <BookOpen size={24} />, path: "/staff/marks", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
    { name: "Assignments", desc: "Create and manage student module assignments", icon: <FileText size={24} />, path: "/staff/assignments", color: "#6366f1", bg: "rgba(99, 102, 241, 0.1)" },
    { name: "Attendance", desc: "Mark daily lecture attendance roll sheet", icon: <ClipboardList size={24} />, path: "/staff/attendance", color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" },
    { name: "Placement", desc: "Post recruitment drives & company notices", icon: <Briefcase size={24} />, path: "/staff/placement", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.1)" },
    { name: "Notifications", desc: "Broadcast announcements and exam alerts", icon: <Bell size={24} />, path: "/staff/notifications", color: "#ec4899", bg: "rgba(236, 72, 153, 0.1)" },
    { name: "Feedback", desc: "Review and respond to student course evaluations", icon: <MessageSquare size={24} />, path: "/staff/feedback", color: "#14b8a6", bg: "rgba(20, 184, 166, 0.1)" }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [courseRes, studentRes, placementRes] = await Promise.all([
        getCourses(),
        getStudents(),
        getPlacements(),
      ]);

      if (courseRes.data) setCourses(courseRes.data);
      setMetrics({
        totalStudents: Array.isArray(studentRes.data) ? studentRes.data.length : 12,
        activePlacements: Array.isArray(placementRes.data) ? placementRes.data.length : 4,
      });
    } catch (err) {
      console.error("Error fetching staff dashboard data:", err);
    }
  };

  const selectedCourse = courses.find(
    (c) => c.code === staffCourse || c.code.includes(staffCourse) || (c.code === "PGCP-AC" && staffCourse === "DAC")
  ) || {
    name: "PG Course in Advanced Computing (PGCP-AC)",
    code: "PGCP-AC",
    modulesList: "C Programming, Data Structures & Algorithms, OOP with Java, Web Programming, Database Technologies, .NET, Java Enterprise Technologies, Spring Boot, Microservices, React, DevOps, Aptitude, Project"
  };

  const moduleItems = selectedCourse.modulesList
    ? selectedCourse.modulesList.split(",").map((m) => m.trim())
    : [];

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container} className="animate-fade-in">
        {/* HERO BANNER */}
        <div style={styles.heroBanner}>
          <div style={styles.heroContent}>
            <span style={styles.roleBadge}>
              <Sparkles size={14} /> FACULTY PORTAL
            </span>
            <h1 style={styles.heading}>
              Welcome back, <span style={styles.name}>{user?.name || "Faculty Member"}</span> 👋
            </h1>
            <p style={styles.subHeading}>
              Manage student records, mark daily attendance, publish examination scores, and manage campus placements.
            </p>
          </div>
        </div>

        {/* QUICK METRICS */}
        <div style={styles.metricsGrid}>
          <div style={styles.metricCard}>
            <div style={styles.metricIconBg}>
              <Users size={20} color="#3b82f6" />
            </div>
            <div>
              <span style={styles.metricLabel}>Total Enrolled Students</span>
              <h3 style={styles.metricVal}>{metrics.totalStudents} Students</h3>
            </div>
          </div>

          <div style={styles.metricCard}>
            <div style={{ ...styles.metricIconBg, background: "rgba(16, 185, 129, 0.1)" }}>
              <TrendingUp size={20} color="#10b981" />
            </div>
            <div>
              <span style={styles.metricLabel}>Average Attendance</span>
              <h3 style={{ ...styles.metricVal, color: "#10b981" }}>92.4%</h3>
            </div>
          </div>

          <div style={styles.metricCard}>
            <div style={{ ...styles.metricIconBg, background: "rgba(139, 92, 246, 0.1)" }}>
              <Briefcase size={20} color="#8b5cf6" />
            </div>
            <div>
              <span style={styles.metricLabel}>Active Placement Drives</span>
              <h3 style={{ ...styles.metricVal, color: "#8b5cf6" }}>{metrics.activePlacements} Drives</h3>
            </div>
          </div>
        </div>

        {/* COURSE-WISE SYLLABUS & MODULES SECTION */}
        <div style={styles.courseSection}>
          <div style={styles.courseHeader}>
            <div>
              <h2 style={styles.sectionTitle}>
                <Layers size={22} color="#4f46e5" style={{ verticalAlign: "middle", marginRight: "8px" }} />
                Course Modules & Curriculum
              </h2>
              <p style={styles.sectionSub}>Select a C-DAC course to view its specific academic module list</p>
            </div>

            <div style={styles.courseBadgeBox}>
              <BookOpen size={18} color="#6366f1" />
              <span style={styles.courseBadgeText}>
                Department / Assigned Course: <strong>{selectedCourse.name}</strong>
              </span>
            </div>
          </div>

          <div style={styles.modulesCard}>
            <h3 style={styles.selectedCourseTitle}>{selectedCourse.name}</h3>
            <div style={styles.modulesGrid}>
              {moduleItems.map((modName, idx) => (
                <div key={idx} style={styles.moduleBadgeCard}>
                  <div style={styles.modNum}>{idx + 1}</div>
                  <span style={styles.modName}>{modName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ACADEMIC MANAGEMENT MODULES */}
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Faculty Management Services</h2>
        </div>

        <div style={styles.grid}>
          {managementModules.map((item, index) => (
            <div
              key={index}
              style={styles.card}
              onClick={() => navigate(item.path)}
              className="hover-card"
            >
              <div style={{ ...styles.iconContainer, background: item.bg, color: item.color }}>
                {item.icon}
              </div>
              <h3 style={styles.cardTitle}>{item.name}</h3>
              <p style={styles.cardDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f8fafc" },
  container: { padding: "30px", maxWidth: "1200px", margin: "0 auto" },
  heroBanner: {
    background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
    borderRadius: "20px",
    padding: "35px",
    color: "#ffffff",
    marginBottom: "30px",
    boxShadow: "0 10px 25px rgba(67, 56, 202, 0.25)",
  },
  heroContent: { maxWidth: "800px" },
  roleBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(255, 255, 255, 0.15)",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    marginBottom: "12px",
    backdropFilter: "blur(4px)",
  },
  heading: { fontSize: "28px", fontWeight: "800", margin: "0 0 10px 0" },
  name: { color: "#818cf8" },
  subHeading: { fontSize: "15px", color: "#c7d2fe", margin: 0, lineHeight: "1.5" },
  metricsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "35px" },
  metricCard: { background: "#ffffff", padding: "20px 24px", borderRadius: "16px", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" },
  metricIconBg: { width: "48px", height: "48px", borderRadius: "12px", background: "rgba(59, 130, 246, 0.1)", display: "flex", justifyContent: "center", alignItems: "center" },
  metricLabel: { fontSize: "13px", color: "#64748b", fontWeight: "500", display: "block" },
  metricVal: { fontSize: "22px", fontWeight: "800", color: "#1e293b", margin: "2px 0 0 0" },
  courseSection: { background: "#ffffff", borderRadius: "18px", padding: "28px", marginBottom: "35px", boxShadow: "0 4px 14px rgba(0,0,0,0.04)" },
  courseHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "20px" },
  sectionTitle: { fontSize: "20px", fontWeight: "700", color: "#1e293b", margin: 0 },
  sectionSub: { fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" },
  selectorWrapper: { display: "flex", alignItems: "center", gap: "10px" },
  courseBadgeBox: { display: "flex", alignItems: "center", gap: "10px", background: "rgba(99, 102, 241, 0.08)", padding: "10px 16px", borderRadius: "10px", border: "1px solid rgba(99, 102, 241, 0.2)" },
  courseBadgeText: { fontSize: "14px", color: "#3730a3" },
  courseSelect: { padding: "8px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", fontWeight: "600", color: "#1e293b", cursor: "pointer", background: "#f8fafc" },
  modulesCard: { background: "#f8fafc", padding: "20px", borderRadius: "14px", border: "1px solid #e2e8f0" },
  selectedCourseTitle: { fontSize: "16px", fontWeight: "700", color: "#334155", margin: "0 0 16px 0" },
  modulesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" },
  moduleBadgeCard: { display: "flex", alignItems: "center", gap: "12px", background: "#ffffff", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" },
  modNum: { width: "26px", height: "26px", borderRadius: "50%", background: "#e0e7ff", color: "#4338ca", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "12px", fontWeight: "700" },
  modName: { fontSize: "13px", fontWeight: "600", color: "#1e293b" },
  sectionHeader: { marginBottom: "20px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" },
  card: { background: "#ffffff", padding: "25px", borderRadius: "16px", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", transition: "all 0.2s ease" },
  iconContainer: { width: "50px", height: "50px", borderRadius: "12px", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "16px" },
  cardTitle: { fontSize: "17px", fontWeight: "700", color: "#1e293b", margin: "0 0 8px 0" },
  cardDesc: { fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.4" },
};