import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";

// STAFF PAGES
import StaffDashboard from "./pages/staff/StaffDashboard";
import Students from "./pages/staff/Students";
import Marks from "./pages/staff/Marks";
import Attendance from "./pages/staff/Attendance";
import Notifications from "./pages/staff/Notifications";
import StaffPlacement from "./pages/staff/Placement";
import AssignmentsStaff from "./pages/staff/Assignments";
import FeedbackStaff from "./pages/staff/Feedback";

// STUDENT PAGES
import StudentDashboard from "./pages/student/StudentDashboard";
import Profile from "./pages/student/Profile";
import MarksStudent from "./pages/student/Marks";
import AttendanceStudent from "./pages/student/Attendance";
import Assignments from "./pages/student/Assignments";
import NotificationsStudent from "./pages/student/Notifications";
import StudentPlacement from "./pages/student/Placement";
import Feedback from "./pages/student/Feedback";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* LOGIN & REGISTER */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* REDIRECT SHORTCUTS */}
          <Route path="/staff" element={<Navigate to="/staff/dashboard" />} />
          <Route path="/student" element={<Navigate to="/student/dashboard" />} />

          {/* ================= STAFF ROUTES ================= */}

          <Route path="/staff/dashboard" element={
            <ProtectedRoute role="staff">
              <StaffDashboard />
            </ProtectedRoute>
          } />

          <Route path="/staff/students" element={
            <ProtectedRoute role="staff">
              <Students />
            </ProtectedRoute>
          } />



          <Route path="/staff/marks" element={
            <ProtectedRoute role="staff">
              <Marks />
            </ProtectedRoute>
          } />

          <Route path="/staff/attendance" element={
            <ProtectedRoute role="staff">
              <Attendance />
            </ProtectedRoute>
          } />

          <Route path="/staff/assignments" element={
            <ProtectedRoute role="staff">
              <AssignmentsStaff />
            </ProtectedRoute>
          } />

          <Route path="/staff/notifications" element={
            <ProtectedRoute role="staff">
              <Notifications />
            </ProtectedRoute>
          } />

          <Route path="/staff/placement" element={
            <ProtectedRoute role="staff">
              <StaffPlacement />
            </ProtectedRoute>
          } />

          <Route path="/staff/feedback" element={
            <ProtectedRoute role="staff">
              <FeedbackStaff />
            </ProtectedRoute>
          } />

          {/* ================= STUDENT ROUTES ================= */}

          <Route path="/student/dashboard" element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          } />

          <Route path="/student/profile" element={
            <ProtectedRoute role="student">
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/student/marks" element={
            <ProtectedRoute role="student">
              <MarksStudent />
            </ProtectedRoute>
          } />



          <Route path="/student/attendance" element={
            <ProtectedRoute role="student">
              <AttendanceStudent />
            </ProtectedRoute>
          } />

          <Route path="/student/assignments" element={
            <ProtectedRoute role="student">
              <Assignments />
            </ProtectedRoute>
          } />

          <Route path="/student/notifications" element={
            <ProtectedRoute role="student">
              <NotificationsStudent />
            </ProtectedRoute>
          } />

          <Route path="/student/placement" element={
            <ProtectedRoute role="student">
              <StudentPlacement />
            </ProtectedRoute>
          } />

          <Route path="/student/feedback" element={
            <ProtectedRoute role="student">
              <Feedback />
            </ProtectedRoute>
          } />

          {/* 404 PAGE */}
          <Route
            path="*"
            element={
              <h1 style={{ textAlign: "center", marginTop: "50px" }}>
                404 - Page Not Found
              </h1>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}