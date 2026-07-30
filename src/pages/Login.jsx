import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/C-DAC_LogoTransp.png";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
  const [role, setRole] = useState("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username) {
      return alert("Please enter username");
    }

    if (!password) {
      return alert("Please enter password");
    }

    // Save login info
    login(role, username);

    // Redirect based on role
    if (role === "staff") {
      navigate("/staff/dashboard");
    } else {
      navigate("/student/dashboard");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src={logo} alt="CDAC Logo" style={styles.logo} />

        <p style={styles.sub}>
          Centre for Development of Advanced Computing
          <br />
        </p>

        {/* ROLE TOGGLE */}
        <div style={styles.roleToggle}>
          {["student", "staff"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              style={{
                ...styles.roleBtn,
                ...(role === r ? styles.activeRole : {}),
              }}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />

          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />

            {/* SHOW/HIDE PASSWORD */}
            <span
              style={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
            {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <div style={styles.rememberContainer}>
            <label>
              <input type="checkbox" /> Remember Me
            </label>
          </div>

          <button type="submit" style={styles.submitBtn}>
            Login as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </form>

        {/* ✅ REGISTER LINK (ADDED) */}
        <p style={styles.registerText}>
          Don’t have an account?{" "}
          <Link to="/register" style={styles.registerLink}>
            Register
          </Link>
        </p>

        <p style={styles.footer}>
          CDAC ACTS Pune © 2026
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)",
  },

  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
    width: "420px",
  },

  logo: {
    width: "110px",
    margin: "0 auto",
    marginBottom: "10px",
    display: "block",
  },

  sub: {
    textAlign: "center",
    color: "#64748b",
    marginBottom: "24px",
    lineHeight: "1.6",
  },

  roleToggle: {
    display: "flex",
    gap: "8px",
    marginBottom: "20px",
  },

  roleBtn: {
    flex: 1,
    padding: "12px",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
    background: "#fff",
    color: "#64748b",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },

  activeRole: {
    background: "#6366f1",
    color: "#fff",
    border: "2px solid #6366f1",
    boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  input: {
    width: "100%",
    padding: "14px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },

  passwordWrapper: {
    position: "relative",
  },

  eye: {
    position: "absolute",
    right: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    userSelect: "none",
    fontSize: "18px",
  },

  rememberContainer: {
    fontSize: "14px",
    color: "#64748b",
  },

  submitBtn: {
    padding: "14px",
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "16px",
    marginTop: "8px",
  },

  /* ✅ NEW STYLES */
  registerText: {
    textAlign: "center",
    marginTop: "15px",
    fontSize: "14px",
    color: "#64748b",
  },

  registerLink: {
    color: "#6366f1",
    fontWeight: "600",
    textDecoration: "none",
  },

  footer: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "12px",
    color: "#94a3b8",
  },
};