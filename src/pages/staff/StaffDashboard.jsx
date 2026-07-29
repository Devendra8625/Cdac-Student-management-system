import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Users, BookOpen, Award, Briefcase, ClipboardList, Bell } from "lucide-react";

export default function StaffDashboard() {
  const navigate = useNavigate();

  // ✅ Only include routes that EXIST
  const modules = [
    {
      name: "Students",
      desc: "Manage student records",
      icon: <Users size={32} />,
      path: "/staff/students",
      color: "#3b82f6"
    },
    {
      name: "Marks",
      desc: "Add and update marks",
      icon: <BookOpen size={32} />,
      path: "/staff/marks",
      color: "#22c55e"
    },
    {
      name: "Grades",
      desc: "Manage grades",
      icon: <Award size={32} />,
      path: "/staff/grades",
      color: "#f59e0b"
    },
    {
      name: "Placement",
      desc: "Manage placements",
      icon: <Briefcase size={32} />,
      path: "/staff/placement",
      color: "#8b5cf6"
    },
    {
      name: "Attendance",
      desc: "Mark attendance",
      icon: <ClipboardList size={32} />,
      path: "/staff/attendance",
      color: "#ef4444"
    },
    {
      name: "Notifications",
      desc: "Post announcements",
      icon: <Bell size={32} />,
      path: "/staff/notifications",
      color: "#ec4899"
    }
  ];

  const activity = [
    "Attendance updated",
    "Marks uploaded",
    "Grades updated"
  ];

  return (
    <div>
      <Navbar />

      <div style={styles.container}>
        <h1 style={styles.heading}>Welcome Back, Staff</h1>
        <p style={styles.subHeading}>
          Manage students, attendance, marks and placements.
        </p>

        <h2 style={styles.title}>Quick Access</h2>

        <div style={styles.grid}>
          {modules.map((item, index) => (
            <div
              key={index}
              style={styles.card}
              onClick={() => navigate(item.path)}
            >
              <div style={{ color: item.color }}>{item.icon}</div>
              <h3 style={styles.cardTitle}>{item.name}</h3>
              <p style={styles.cardText}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={styles.bottom}>
          <div style={styles.box}>
            <h2>Recent Activity</h2>
            {activity.map((item, index) => (
              <p key={index} style={styles.text}>✅ {item}</p>
            ))}
          </div>

          <div style={styles.box}>
            <h2>Notifications</h2>
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

  heading: {
    marginBottom: "5px",
    color: "#1e293b"
  },

  subHeading: {
    color: "#64748b",
    marginBottom: "30px"
  },

  title: {
    color: "#1e293b",
    marginBottom: "20px"
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
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  },

  cardTitle: {
    marginTop: "15px",
    marginBottom: "8px",
    color: "#1e293b"
  },

  cardText: {
    color: "#64748b",
    fontSize: "14px"
  },

  bottom: {
    display: "flex",
    gap: "20px",
    marginTop: "35px"
  },

  box: {
    flex: 1,
    background: "#fff",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  },

  text: {
    color: "#475569",
    marginTop: "15px"
  }
};