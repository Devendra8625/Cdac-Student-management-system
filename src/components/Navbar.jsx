import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <nav style={styles.nav}>
      <span style={styles.logo}>🎓 CDAC Management System</span>

      <div style={styles.right}>
        {/* 👤 User Info */}
        <div style={styles.userInfo}>
          <User size={18} />
          <span style={styles.userText}>
            {user?.name || "Guest"} ({user?.role || "N/A"})
          </span>
        </div>

        {/* 🚪 Logout */}
        {user && (
          <button onClick={handleLogout} style={styles.btn}>
            <LogOut size={16} /> Logout
          </button>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    background: "#1e293b",
    color: "#fff",
  },

  logo: {
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#334155",
    padding: "6px 10px",
    borderRadius: "8px",
  },

  userText: {
    fontSize: "14px",
  },

  btn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};