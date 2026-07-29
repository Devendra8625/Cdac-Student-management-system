import Navbar from "../../components/Navbar";

export default function Marks() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: "30px" }}>
        <h1>Marks</h1>

        <table border="1">
          <tr><th>Subject</th><th>Marks</th></tr>
          <tr><td>Java</td><td>85</td></tr>
          <tr><td>DBMS</td><td>78</td></tr>
        </table>
      </div>
    </div>
  );
}