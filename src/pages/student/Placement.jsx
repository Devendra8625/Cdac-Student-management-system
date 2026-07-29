import { useEffect, useState } from "react";

export default function Placement() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH DATA FROM BACKEND
  useEffect(() => {
    fetch("http://localhost:5000/api/placements")
      .then((res) => res.json())
      .then((data) => {
        setDrives(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching placements:", err);
        setLoading(false);
      });
  }, []);

  // 🔥 APPLY FUNCTION (API CALL)
  const handleApply = (jobId) => {
    fetch("http://localhost:5000/api/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobId }),
    })
      .then((res) => res.json())
      .then(() => alert("Applied successfully ✅"))
      .catch(() => alert("Error applying ❌"));
  };

  if (loading) return <h3 style={{ padding: "20px" }}>Loading...</h3>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Placement Opportunities</h2>

      {drives.length === 0 ? (
        <p>No placement drives available</p>
      ) : (
        <div style={styles.grid}>
          {drives.map((job) => (
            <div key={job.id} style={styles.card}>
              <h3>{job.company}</h3>
              <p><strong>Role:</strong> {job.role}</p>
              <p><strong>Package:</strong> {job.package}</p>
              <p><strong>Location:</strong> {job.location}</p>

              <button
                style={styles.button}
                onClick={() => handleApply(job.id)}
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}
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