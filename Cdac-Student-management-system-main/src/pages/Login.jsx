import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import logo from "../assets/C-DAC_LogoTransp.png";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim()) {
      return setErrorMsg("Please enter your registered email address.");
    }

    if (!password.trim()) {
      return setErrorMsg("Please enter your password.");
    }

    setLoading(true);

    try {
      // Call Auth service with selected role
      const res = await loginUser({ email: email.trim(), password: password.trim(), role: role });
      
      if (res.data && res.data.token) {
        const token = res.data.token;
        const userRole = role === "staff" || role === "faculty" || role === "admin"
          ? "staff"
          : (res.data.role ? res.data.role.toLowerCase().replace("role_", "") : "student");

        login({ name: res.data.email || email.trim(), role: userRole }, token);
        setLoading(false);
        navigate(userRole === "staff" ? "/staff/dashboard" : "/student/dashboard");
        return;
      } else {
        setErrorMsg("Authentication failed. Invalid response from auth service.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      const serverMsg = err.response?.data?.message || err.response?.data;
      if (typeof serverMsg === "string" && serverMsg.trim()) {
        setErrorMsg(serverMsg);
      } else if (err.response?.status === 401 || err.response?.status === 400 || err.response?.status === 403) {
        setErrorMsg("Invalid email or password. Please check your credentials.");
      } else {
        setErrorMsg("Unable to connect to Auth Backend. Ensure backend microservices are running on port 8080.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src={logo} alt="CDAC Logo" style={styles.logo} />

        <p style={styles.sub}>
          Centre for Development of Advanced Computing
        </p>

        {/* ROLE TOGGLE */}
        <div style={styles.roleToggle}>
          {["student", "staff"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRole(r);
                setErrorMsg("");
              }}
              style={{
                ...styles.roleBtn,
                ...(role === r ? styles.activeRole : {}),
              }}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* ERROR BADGE */}
        {errorMsg && <div style={styles.errorBox}>{errorMsg}</div>}

        {/* FORM */}
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Enter Registered Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />

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

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Authenticating with Backend..." : `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </button>
        </form>

        {/* REGISTER LINK */}
        <p style={styles.registerText}>
          Don’t have an account?{" "}
          <Link to="/register" style={styles.registerLink}>
            Register Here
          </Link>
        </p>

        <p style={styles.footer}>CDAC ACTS Pune © 2026</p>
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
    padding: "40px 24px",
    borderRadius: "16px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "420px",
    boxSizing: "border-box",
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
  errorBox: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "15px",
    textAlign: "center",
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
    fontSize: "18px",
    color: "#64748b",
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
    transition: "0.3s",
  },
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