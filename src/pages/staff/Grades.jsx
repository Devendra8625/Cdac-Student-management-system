import Navbar from "../../components/Navbar";

export default function Grades() {
  return (
    <div>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <h1>Grades Management</h1>

        <table border="1">
          <tr>
            <th>Student</th>
            <th>Subject</th>
            <th>Grade</th>
          </tr>

          <tr>
            <td>John</td>
            <td>Java</td>
            <td>A</td>
          </tr>

          <tr>
            <td>Sam</td>
            <td>DBMS</td>
            <td>B+</td>
          </tr>
        </table>
      </div>
    </div>
  );
}