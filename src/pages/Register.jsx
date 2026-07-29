import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/C-DAC_LogoTransp.png";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.username || !form.password) {
      return alert("Please fill all fields");
    }

    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match");
    }

    alert("Registration successful ✅");

    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        <img src={logo} alt="CDAC Logo" style={styles.logo} />

        <h2 style={styles.title}>Student Registration</h2>

        <form onSubmit={handleRegister} style={styles.form}>

          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>

        <p style={styles.loginText}>
          Already have an account?{" "}
          <Link to="/" style={styles.link}>Login</Link>
        </p>

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "16px",
    width: "420px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
  },
  logo: {
    width: "100px",
    display: "block",
    margin: "0 auto 10px",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },
  button: {
    padding: "12px",
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
  loginText: {
    textAlign: "center",
    marginTop: "15px",
  },
  link: {
    color: "#6366f1",
    fontWeight: "600",
  },
};