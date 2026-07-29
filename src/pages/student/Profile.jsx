import Navbar from "../../components/Navbar";

export default function Profile() {
  return (
    <div>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <h1>My Profile</h1>

        <div>
          <p><b>Name:</b> John Doe</p>
          <p><b>Email:</b> john@mail.com</p>
          <p><b>Course:</b> DAC</p>
        </div>
      </div>
    </div>
  );
}