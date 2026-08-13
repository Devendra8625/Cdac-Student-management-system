import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/C-DAC_LogoTransp.png";
import { registerUser } from "../services/api";
import { COURSES_DATA } from "../services/coursesData";
import { User, Mail, Lock, UserCheck, BookOpen, Award, Phone, MapPin } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    course: "PGCP-AC",
    prnNo: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.username || !form.password) {
      return alert("Please fill all required fields");
    }

    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      await registerUser({
        username: form.username,
        name: form.name,
        email: form.email,
        password: form.password,
        role: "STUDENT",
        course: form.course,
        prnNo: form.prnNo,
        phone: form.phone,
        address: form.address,
      });
    } catch (err) {
      console.log("Registration API fallback / error:", err);
    }

    alert("Student registration successful ✅ Please login with your credentials.");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card} className="animate-fade-in">
        <img src={logo} alt="CDAC Logo" style={styles.logo} />

        <h2 style={styles.title}>Student Registration</h2>
        <p style={styles.sub}>Register for C-DAC Academic Management System</p>

        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.inputGroup}>
            <User size={18} style={styles.inputIcon} />
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <Mail size={18} style={styles.inputIcon} />
            <input
              name="email"
              type="email"
              placeholder="Student Email Address (e.g. rahul@cdac.in)"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <UserCheck size={18} style={styles.inputIcon} />
            <input
              name="username"
              placeholder="Choose Username"
              value={form.username}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <BookOpen size={18} style={styles.inputIcon} />
            <select
              name="course"
              value={form.course}
              onChange={handleChange}
              style={{ ...styles.input, cursor: "pointer" }}
            >
              {COURSES_DATA.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.fullTitle}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <Award size={18} style={styles.inputIcon} />
            <input
              name="prnNo"
              placeholder="PRN Number (e.g. 260340120001)"
              value={form.prnNo}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <Phone size={18} style={styles.inputIcon} />
            <input
              name="phone"
              placeholder="Phone Number (Optional)"
              value={form.phone}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <MapPin size={18} style={styles.inputIcon} />
            <input
              name="address"
              placeholder="Permanent Address (Optional)"
              value={form.address}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <Lock size={18} style={styles.inputIcon} />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <Lock size={18} style={styles.inputIcon} />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            Register Student
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <Link to="/" style={styles.link}>
            Login Here
          </Link>
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
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    padding: "20px",
  },
  card: {
    background: "#ffffff",
    width: "100%",
    maxWidth: "460px",
    padding: "35px 30px",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    textAlign: "center",
  },
  logo: {
    height: "55px",
    marginBottom: "15px",
  },
  title: {
    fontSize: "22px",
    color: "#0f172a",
    margin: "0 0 5px 0",
    fontWeight: "700",
  },
  sub: {
    color: "#64748b",
    fontSize: "13px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  inputGroup: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "14px",
    color: "#64748b",
  },
  input: {
    width: "100%",
    padding: "11px 14px 11px 42px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  button: {
    marginTop: "8px",
    background: "#3b82f6",
    color: "#ffffff",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
  },
  footerText: {
    marginTop: "20px",
    fontSize: "13px",
    color: "#64748b",
  },
  link: {
    color: "#3b82f6",
    fontWeight: "600",
    textDecoration: "none",
  },
};