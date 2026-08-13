import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { LogOut, User, GraduationCap, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const isStaff = user?.role === "staff" || user?.role === "ROLE_STAFF";
  const dashboardPath = isStaff ? "/staff/dashboard" : "/student/dashboard";

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {/* LOGO */}
        <Link to={dashboardPath} style={styles.brand}>
          <div style={styles.logoIcon}>
            <GraduationCap size={22} color="#fff" />
          </div>
          <div>
            <span style={styles.brandTitle}>C-DAC</span>
            <span style={styles.brandSub}>ACADEMIC PORTAL</span>
          </div>
        </Link>

        {/* RIGHT ACTION BAR */}
        <div style={styles.rightGroup}>
          {user && (
            <Link
              to={dashboardPath}
              style={{
                ...styles.navLink,
                ...(location.pathname.endsWith("/dashboard") ? styles.navLinkActive : {}),
              }}
            >
              <LayoutDashboard size={16} /> Dashboard
            </Link>
          )}

          {/* USER PROFILE BADGE */}
          <div style={styles.userBadge}>
            <div style={styles.avatarCircle}>
              <User size={15} color="#818cf8" />
            </div>
            <div style={styles.userMeta}>
              <span style={styles.userName}>{user?.name || "Guest"}</span>
              <span style={isStaff ? styles.roleStaff : styles.roleStudent}>
                {user?.role ? user.role.toUpperCase() : "VISITOR"}
              </span>
            </div>
          </div>

          {/* LOGOUT BUTTON */}
          {user && (
            <button style={styles.logoutBtn} onClick={handleLogout} title="Logout of System">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: "#0f172a",
    borderBottom: "1px solid #1e293b",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "10px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textDecoration: "none",
  },
  logoIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 10px rgba(99, 102, 241, 0.3)",
  },
  brandTitle: {
    display: "block",
    fontSize: "18px",
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: "0.5px",
    lineHeight: "1.1",
  },
  brandSub: {
    display: "block",
    fontSize: "10px",
    fontWeight: "700",
    color: "#818cf8",
    letterSpacing: "1px",
  },
  rightGroup: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "600",
    padding: "8px 12px",
    borderRadius: "8px",
    transition: "all 0.2s ease",
  },
  navLinkActive: {
    color: "#ffffff",
    background: "rgba(255, 255, 255, 0.1)",
  },
  userBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(30, 41, 59, 0.8)",
    padding: "6px 12px",
    borderRadius: "20px",
    border: "1px solid #334155",
  },
  avatarCircle: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "rgba(99, 102, 241, 0.15)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  userMeta: {
    display: "flex",
    flexDirection: "column",
  },
  userName: {
    color: "#f8fafc",
    fontSize: "12px",
    fontWeight: "700",
    lineHeight: "1.2",
  },
  roleStudent: {
    color: "#38bdf8",
    fontSize: "9px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  roleStaff: {
    color: "#fbbf24",
    fontSize: "9px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(239, 68, 68, 0.15)",
    color: "#f87171",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};