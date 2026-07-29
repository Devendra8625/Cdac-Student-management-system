import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/C-DAC_LogoTransp.png";

export default function Login() {
  const [role, setRole] = useState("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) return alert("Fill all fields");
    login(role, username);
    navigate(role === "staff" ? "/staff" : "/student");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
       <img src={logo} alt="CDAC Logo" ali style={{ width: "80px",margin: "0 auto", marginBottom: "8px",display: "block"}} />

<p style={styles.sub}>Centre for Development of Advanced Computing</p>
        <div style={styles.roleToggle}>
          {["student", "staff"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              style={{ ...styles.roleBtn, ...(role === r ? styles.activeRole : {}) }}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.submitBtn}>Login as {role}</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight:"100vh", display:"flex", alignItems:"center",
    justifyContent:"center", background:"#f1f5f9" },
  card: { background:"#fff", padding:"40px", borderRadius:"16px",
    boxShadow:"0 4px 24px rgba(0,0,0,0.1)", width:"360px" },
  title: { textAlign:"center", margin:0, color:"#1e293b" },
  sub: { textAlign:"center", color:"#94a3b8", marginBottom:"24px" },
  roleToggle: { display:"flex", gap:"8px", marginBottom:"20px" },
  roleBtn: { flex:1, padding:"10px", border:"2px solid #e2e8f0",
    borderRadius:"8px", cursor:"pointer", background:"#fff", color:"#64748b", fontWeight:"600" },
  activeRole: { borderColor:"#6366f1", background:"#eef2ff", color:"#6366f1" },
  form: { display:"flex", flexDirection:"column", gap:"12px" },
  input: { padding:"12px", border:"1px solid #e2e8f0", borderRadius:"8px",
    fontSize:"14px", outline:"none" },
  submitBtn: { padding:"12px", background:"#6366f1", color:"#fff",
    border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:"bold", fontSize:"15px" }
};