import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <span style={styles.logo}>🎓 CDAC Management System</span>
      <div style={styles.right}>
        <User size={16} />
        <span style={{ margin: "0 8px" }}>{user?.name} ({user?.role})</span>
        <button onClick={handleLogout} style={styles.btn}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: { display:"flex", justifyContent:"space-between", alignItems:"center",
    padding:"12px 24px", background:"#1e293b", color:"#fff" },
  logo: { fontSize:"18px", fontWeight:"bold" },
  right: { display:"flex", alignItems:"center", gap:"6px" },
  btn: { display:"flex", alignItems:"center", gap:"4px", background:"#ef4444",
    color:"#fff", border:"none", padding:"6px 12px", borderRadius:"6px", cursor:"pointer" }
};