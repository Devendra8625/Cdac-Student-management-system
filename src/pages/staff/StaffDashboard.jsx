import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Users, BookOpen, Award, Briefcase, ClipboardList, Bell } from "lucide-react";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const modules = [
    { name:"Students", desc:"Manage student records", icon:<Users size={30}/>, path:"/staff/students", color:"#3b82f6" },
    { name:"Marks", desc:"Add and update marks", icon:<BookOpen size={30}/>, path:"/staff/marks", color:"#22c55e" },
    { name:"Grades", desc:"Manage grades", icon:<Award size={30}/>, path:"/staff/grades", color:"#f59e0b" },
    { name:"Placement", desc:"Manage placements", icon:<Briefcase size={30}/>, path:"/staff/placement", color:"#8b5cf6" },
    { name:"Attendance", desc:"Mark attendance", icon:<ClipboardList size={30}/>, path:"/staff/attendance", color:"#ef4444" },
    { name:"Notifications", desc:"Post announcements", icon:<Bell size={30}/>, path:"/staff/notifications", color:"#ec4899" }
  ];

  const activity = ["Attendance updated", "Marks uploaded", "Grades updated"];

  return (
    <div>
      <Navbar />

      <div style={styles.container}>
        
        {/* HEADER */}
        <div style={styles.header}>
          <h1 style={styles.heading}>
            Welcome back, <span style={styles.name}>{user?.name || "Staff"}</span> 👋
          </h1>
          <p style={styles.subHeading}>
            Manage students, attendance, marks, and placements efficiently.
          </p>
        </div>

        {/* QUICK ACCESS */}
        <h2 style={styles.title}>Quick Access</h2>

        <div style={styles.grid}>
          {modules.map((item, index) => (
            <div
              key={index}
              style={styles.card}
              onClick={() => navigate(item.path)}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ color: item.color }}>{item.icon}</div>
              <h3 style={styles.cardTitle}>{item.name}</h3>
              <p style={styles.cardText}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* BOTTOM SECTION */}
        <div style={styles.bottom}>
          <div style={styles.box}>
            <h2 style={styles.boxTitle}>Recent Activity</h2>
            {activity.map((item, index) => (
              <p key={index} style={styles.text}>✅ {item}</p>
            ))}
          </div>

          <div style={styles.box}>
            <h2 style={styles.boxTitle}>Notifications</h2>
            <p style={styles.text}>📌 No recent updates available</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    background: "#f8fafc",
    minHeight: "100vh"
  },

  header: {
    marginBottom: "25px"
  },

  heading: {
    marginBottom: "5px",
    color: "#1e293b",
    fontSize: "26px",
    fontWeight: "700"
  },

  name: {
    color: "#6366f1"
  },

  subHeading: {
    color: "#64748b",
    fontSize: "15px"
  },

  title: {
    color: "#1e293b",
    marginBottom: "20px",
    fontWeight: "600"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
    gap: "20px"
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "15px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    transition: "0.3s"
  },

  cardTitle: {
    marginTop: "12px",
    marginBottom: "6px",
    color: "#1e293b",
    fontWeight: "600"
  },

  cardText: {
    color: "#64748b",
    fontSize: "14px"
  },

  bottom: {
    display: "flex",
    gap: "20px",
    marginTop: "35px",
    flexWrap: "wrap"
  },

  box: {
    flex: 1,
    minWidth: "280px",
    background: "#fff",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
  },

  boxTitle: {
    color: "#1e293b",
    fontWeight: "600"
  },

  text: {
    color: "#475569",
    marginTop: "12px",
    fontSize: "14px"
  }
};