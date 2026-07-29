import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { User, BookOpen, Award, ClipboardList, Briefcase, FileText, Bell, MessageSquare } from "lucide-react";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const modules = [
    { name:"Profile", desc:"View your profile", icon:<User size={32}/>, path:"/student/profile", color:"#3b82f6" },
    { name:"Marks", desc:"View marks", icon:<BookOpen size={32}/>, path:"/student/marks", color:"#22c55e" },
    { name:"Grades", desc:"Check grades", icon:<Award size={32}/>, path:"/student/grades", color:"#f59e0b" },
    { name:"Attendance", desc:"View attendance", icon:<ClipboardList size={32}/>, path:"/student/attendance", color:"#ef4444" },
    { name:"Placement", desc:"Placement details", icon:<Briefcase size={32}/>, path:"/student/placement", color:"#8b5cf6" },
    { name:"Assignments", desc:"View assignments", icon:<FileText size={32}/>, path:"/student/assignments", color:"#06b6d4" },
    { name:"Notifications", desc:"Latest updates", icon:<Bell size={32}/>, path:"/student/notifications", color:"#ec4899" },
    { name:"Feedback", desc:"Give feedback", icon:<MessageSquare size={32}/>, path:"/student/feedback", color:"#14b8a6" }
  ];

  const activity = ["Assignment submitted", "Attendance updated", "Marks published"];

  return (
    <div>
      <Navbar />

      <div style={styles.container}>
        <h1 style={styles.heading}>Welcome Back, Student</h1>
        <p style={styles.subHeading}>Access your academic information and updates.</p>

        <h2 style={styles.title}>Quick Access</h2>

        <div style={styles.grid}>
          {modules.map((item, index) => (
            <div key={index} style={styles.card} onClick={() => navigate(item.path)}>
              <div style={{ color:item.color }}>{item.icon}</div>
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
  container:{ padding:"30px", background:"#f8fafc", minHeight:"100vh" },
  heading:{ marginBottom:"5px", color:"#1e293b" },
  subHeading:{ color:"#64748b", marginBottom:"30px" },
  title:{ color:"#1e293b", marginBottom:"20px" },

  grid:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",
    gap:"20px"
  },

  card:{
    background:"#fff",
    padding:"20px",
    borderRadius:"15px",
    textAlign:"center",
    cursor:"pointer",
    boxShadow:"0 2px 8px rgba(0,0,0,0.1)"
  },

  cardTitle:{ marginTop:"15px", marginBottom:"8px", color:"#1e293b" },
  cardText:{ color:"#64748b", fontSize:"14px" },

  bottom:{
    display:"flex",
    gap:"20px",
    marginTop:"35px"
  },

  box:{
    flex:1,
    background:"#fff",
    borderRadius:"15px",
    padding:"25px",
    boxShadow:"0 2px 8px rgba(0,0,0,0.1)"
  },

  text:{ color:"#475569", marginTop:"15px" }
};