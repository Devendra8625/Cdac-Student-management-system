import { useState } from "react";

export default function Marks() {
  const [studentId, setStudentId] = useState("");
  const [marks, setMarks] = useState("");

  const handleSubmit = () => {
    alert(`Marks ${marks} added for student ${studentId}`);
  };

  return (
    <div>
      <h2>Add Marks</h2>

      <input
        placeholder="Student ID"
        onChange={e => setStudentId(e.target.value)}
      />

      <input
        placeholder="Marks"
        onChange={e => setMarks(e.target.value)}
      />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}