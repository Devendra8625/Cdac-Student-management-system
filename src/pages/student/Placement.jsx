import { useState } from "react";

export default function Placement() {
  const [drives] = useState([
    {
      id: 1,
      company: "TCS",
      role: "Software Engineer",
      package: "₹4 LPA",
      location: "Pune",
    },
    {
      id: 2,
      company: "Infosys",
      role: "System Engineer",
      package: "₹3.6 LPA",
      location: "Bangalore",
    },
    {
      id: 3,
      company: "Wipro",
      role: "Project Engineer",
      package: "₹3.5 LPA",
      location: "Hyderabad",
    },
  ]);

  const handleApply = (company) => {
    alert(`Applied to ${company} successfully ✅`);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Placement Opportunities</h2>

      <div style={styles.grid}>
        {drives.map((job) => (
          <div key={job.id} style={styles.card}>
            <h3>{job.company}</h3>
            <p><strong>Role:</strong> {job.role}</p>
            <p><strong>Package:</strong> {job.package}</p>
            <p><strong>Location:</strong> {job.location}</p>

            <button
              style={styles.button}
              onClick={() => handleApply(job.company)}
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
  },
  title: {
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
  button: {
    marginTop: "10px",
    padding: "10px",
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};