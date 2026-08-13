import axios from "axios";
import { getStorageData, saveStorageData } from "./mockData";
import { getFormattedCourses } from "./coursesData";

// Live Spring Boot API Gateway URL
const API_BASE_URL = "http://localhost:8080/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000,
});

// Attach JWT token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Helper for GET reads with fallback if backend is offline
const fetchWithFallback = async (apiCall, mockFallback) => {
  try {
    const res = await apiCall();
    return res;
  } catch (err) {
    if (err.response) {
      throw err;
    }
    console.warn("Backend offline, utilizing local mock fallback:", err.message);
    const mockData = await mockFallback();
    return { data: mockData };
  }
};

// ================= AUTH =================
export const loginUser = async (data) => {
  try {
    const res = await API.post("/auth/login", data);
    return res;
  } catch (err) {
    if (err.response) {
      throw err;
    }
    console.warn("Auth Backend offline, fallback to mock mode");
    const email = data.email ? data.email.trim() : "";
    const reqRole = data.role ? data.role.toLowerCase() : "";
    const isStaff = reqRole === "staff" || reqRole === "faculty" || reqRole === "admin" || email.includes("staff") || email.includes("faculty") || email.includes("admin");
    const role = isStaff ? "ROLE_STAFF" : "ROLE_STUDENT";
    return {
      data: {
        token: "mock-jwt-token-" + Date.now(),
        role: role,
        email: email,
        name: email.split("@")[0] || "User",
      },
    };
  }
};

export const registerUser = async (data) => {
  try {
    const res = await API.post("/auth/register", data);
    
    // If student registration, also seed/create student record in student-service
    if (data.role === "STUDENT" || data.role === "ROLE_STUDENT") {
      try {
        await API.post("/students", {
          name: data.name || data.username,
          email: data.email,
          course: data.course || "DAC",
          prnNo: data.prnNo || "",
          rollNo: `DAC-2026-${Math.floor(100 + Math.random() * 900)}`,
          batch: "Feb 2026",
          phone: data.phone || "",
          address: data.address || ""
        });
      } catch (stErr) {
        console.warn("Could not pre-create student record in student-service:", stErr);
      }
    }

    return res;
  } catch (err) {
    if (err.response) {
      throw err;
    }
    const students = getStorageData("students");
    const newStudent = {
      id: Date.now(),
      name: data.name || data.username || "New Student",
      email: data.email,
      course: data.course || "DAC",
      prnNo: data.prnNo || "",
      rollNo: `DAC-2026-${Math.floor(100 + Math.random() * 900)}`,
      batch: "Feb 2026",
      phone: data.phone || "",
      address: data.address || ""
    };
    students.push(newStudent);
    saveStorageData("students", students);
    return { data: { message: "User registered successfully", student: newStudent } };
  }
};

// ================= STUDENTS =================
export const getStudents = async () => {
  return fetchWithFallback(
    () => API.get("/students"),
    async () => getStorageData("students")
  );
};

export const getStudentById = async (id) => {
  return fetchWithFallback(
    () => API.get(`/students/${id}`),
    async () => {
      const students = getStorageData("students");
      return students.find((s) => s.id === Number(id) || s.rollNo === id) || students[0];
    }
  );
};

export const getStudentByEmail = async (email) => {
  return fetchWithFallback(
    () => API.get(`/students/email/${encodeURIComponent(email)}`),
    async () => {
      const students = getStorageData("students");
      const found = students.find((s) => s.email?.toLowerCase() === email?.toLowerCase());
      if (found) return found;
      return {
        id: Date.now(),
        name: email.split("@")[0],
        email: email,
        course: "DAC",
        rollNo: "DAC-2026-001",
        batch: "Feb 2026",
        prnNo: "",
        phone: "",
        address: ""
      };
    }
  );
};

export const updateStudentByEmail = async (email, data) => {
  return fetchWithFallback(
    () => API.put(`/students/email/${encodeURIComponent(email)}`, data),
    async () => {
      let students = getStorageData("students");
      let found = false;
      students = students.map((s) => {
        if (s.email?.toLowerCase() === email?.toLowerCase()) {
          found = true;
          return { ...s, ...data };
        }
        return s;
      });
      if (!found) {
        students.push({ id: Date.now(), email, ...data });
      }
      saveStorageData("students", students);
      return data;
    }
  );
};

export const addStudent = async (data) => {
  const courseCode = data.course || "DAC";
  const rollNo = data.rollNo || `${courseCode}-2026-${Math.floor(100 + Math.random() * 900)}`;
  const payload = {
    rollNo,
    batch: data.batch || "Feb 2026",
    prnNo: data.prnNo || "",
    phone: data.phone || "",
    address: data.address || "",
    ...data,
  };

  return fetchWithFallback(
    () => API.post("/students", payload),
    async () => {
      const students = getStorageData("students");
      const newStudent = { id: Date.now(), ...payload };
      students.push(newStudent);
      saveStorageData("students", students);
      return newStudent;
    }
  );
};

export const updateStudent = async (id, data) => {
  return fetchWithFallback(
    () => API.put(`/students/${id}`, data),
    async () => {
      let students = getStorageData("students");
      students = students.map((s) => (s.id === Number(id) ? { ...s, ...data } : s));
      saveStorageData("students", students);
      return data;
    }
  );
};

export const deleteStudent = async (id) => {
  return fetchWithFallback(
    () => API.delete(`/students/${id}`),
    async () => {
      let students = getStorageData("students");
      students = students.filter((s) => s.id !== Number(id));
      saveStorageData("students", students);
      return { success: true };
    }
  );
};

// ================= MARKS =================
export const getMarks = async () => {
  return fetchWithFallback(
    () => API.get("/marks"),
    async () => getStorageData("marks")
  );
};

export const getMarksByStudent = async (studentId) => {
  return fetchWithFallback(
    () => API.get(`/marks/student/${studentId}`),
    async () => {
      const marks = getStorageData("marks");
      const filtered = marks.filter((m) => m.studentId === studentId || m.studentId === "DAC-2026-001");
      return filtered.length ? filtered : marks;
    }
  );
};

export const addMarks = async (data) => {
  return fetchWithFallback(
    () => API.post("/marks", data),
    async () => {
      const marks = getStorageData("marks");
      const newMark = { id: Date.now(), ...data };
      marks.push(newMark);
      saveStorageData("marks", marks);
      return newMark;
    }
  );
};

export const updateMarks = async (id, data) => {
  return fetchWithFallback(
    () => API.put(`/marks/${id}`, data),
    async () => {
      let marks = getStorageData("marks");
      marks = marks.map((m) => (m.id === Number(id) ? { ...m, ...data } : m));
      saveStorageData("marks", marks);
      return data;
    }
  );
};

export const deleteMarks = async (id) => {
  return fetchWithFallback(
    () => API.delete(`/marks/${id}`),
    async () => {
      let marks = getStorageData("marks");
      marks = marks.filter((m) => m.id !== Number(id));
      saveStorageData("marks", marks);
      return { success: true };
    }
  );
};

// ================= ATTENDANCE =================
export const getAttendance = async () => {
  return fetchWithFallback(
    () => API.get("/attendance"),
    async () => getStorageData("attendance")
  );
};

export const getAttendanceByStudent = async (studentId) => {
  return fetchWithFallback(
    () => API.get(`/attendance/student/${studentId}`),
    async () => getStorageData("attendance")
  );
};

export const getAttendanceByDate = async (date) => {
  return fetchWithFallback(
    () => API.get(`/attendance/date/${date}`),
    async () => {
      const attendance = getStorageData("attendance");
      return attendance.filter((a) => a.date === date);
    }
  );
};

export const addAttendance = async (data) => {
  return fetchWithFallback(
    () => API.post("/attendance", data),
    async () => {
      const attendance = getStorageData("attendance");
      const newItem = { id: Date.now(), ...data };
      attendance.push(newItem);
      saveStorageData("attendance", attendance);
      return newItem;
    }
  );
};

export const deleteAttendance = async (id) => {
  return fetchWithFallback(
    () => API.delete(`/attendance/${id}`),
    async () => {
      let attendance = getStorageData("attendance");
      attendance = attendance.filter((a) => a.id !== Number(id));
      saveStorageData("attendance", attendance);
      return { success: true };
    }
  );
};

// ================= COURSES =================
export const getCourses = async () => {
  const defaultCourses = getFormattedCourses();
  return fetchWithFallback(
    () => API.get("/courses"),
    async () => {
      const stored = getStorageData("courses");
      return (stored && stored.length >= 12) ? stored : defaultCourses;
    }
  );
};

export const addCourse = async (data) => {
  return fetchWithFallback(
    () => API.post("/courses", data),
    async () => {
      const courses = getStorageData("courses") || [];
      const newCourse = { id: Date.now(), ...data };
      courses.push(newCourse);
      saveStorageData("courses", courses);
      return newCourse;
    }
  );
};

export const updateCourse = async (id, data) => {
  return fetchWithFallback(
    () => API.put(`/courses/${id}`, data),
    async () => {
      let courses = getStorageData("courses") || [];
      courses = courses.map((c) => (c.id === Number(id) ? { ...c, ...data } : c));
      saveStorageData("courses", courses);
      return data;
    }
  );
};

export const deleteCourse = async (id) => {
  return fetchWithFallback(
    () => API.delete(`/courses/${id}`),
    async () => {
      let courses = getStorageData("courses") || [];
      courses = courses.filter((c) => c.id !== Number(id));
      saveStorageData("courses", courses);
      return { success: true };
    }
  );
};

// ================= ASSIGNMENTS =================
export const getAssignments = async () => {
  return fetchWithFallback(
    () => API.get("/assignments"),
    async () => getStorageData("assignments")
  );
};

export const addAssignment = async (data) => {
  return fetchWithFallback(
    () => API.post("/assignments", data),
    async () => {
      const assignments = getStorageData("assignments");
      const newItem = { id: Date.now(), status: "Pending", ...data };
      assignments.push(newItem);
      saveStorageData("assignments", assignments);
      return newItem;
    }
  );
};

export const updateAssignment = async (id, data) => {
  return fetchWithFallback(
    () => API.put(`/assignments/${id}`, data),
    async () => {
      let assignments = getStorageData("assignments");
      assignments = assignments.map((a) => (a.id === Number(id) ? { ...a, ...data } : a));
      saveStorageData("assignments", assignments);
      return data;
    }
  );
};

export const deleteAssignment = async (id) => {
  return fetchWithFallback(
    () => API.delete(`/assignments/${id}`),
    async () => {
      let assignments = getStorageData("assignments");
      assignments = assignments.filter((a) => a.id !== Number(id));
      saveStorageData("assignments", assignments);
      return { success: true };
    }
  );
};

// ================= NOTICES / ANNOUNCEMENTS =================
export const getNotices = async () => {
  return fetchWithFallback(
    () => API.get("/notices"),
    async () => getStorageData("notifications")
  );
};

export const addNotice = async (data) => {
  const payload = {
    date: data.date || new Date().toISOString().split("T")[0],
    eventDate: data.eventDate || data.date || new Date().toISOString().split("T")[0],
    message: data.message || data.content || "",
    ...data,
  };
  return fetchWithFallback(
    () => API.post("/notices", payload),
    async () => {
      const notices = getStorageData("notifications") || [];
      const newItem = { id: Date.now(), ...payload };
      notices.unshift(newItem);
      saveStorageData("notifications", notices);
      return newItem;
    }
  );
};

export const deleteNotice = async (id) => {
  return fetchWithFallback(
    () => API.delete(`/notices/${id}`),
    async () => {
      let notices = getStorageData("notifications");
      notices = notices.filter((n) => n.id !== Number(id));
      saveStorageData("notifications", notices);
      return { success: true };
    }
  );
};

// ================= PLACEMENT =================
export const getPlacements = async () => {
  return fetchWithFallback(
    () => API.get("/placement"),
    async () => getStorageData("placements")
  );
};

export const addPlacement = async (data) => {
  return fetchWithFallback(
    () => API.post("/placement", data),
    async () => {
      const placements = getStorageData("placements");
      const newItem = { id: Date.now(), status: "Active", ...data };
      placements.push(newItem);
      saveStorageData("placements", placements);
      return newItem;
    }
  );
};

export const deletePlacement = async (id) => {
  return fetchWithFallback(
    () => API.delete(`/placement/${id}`),
    async () => {
      let placements = getStorageData("placements");
      placements = placements.filter((p) => p.id !== Number(id));
      saveStorageData("placements", placements);
      return { success: true };
    }
  );
};

// ================= FEEDBACK =================
export const getFeedbacks = async () => {
  return fetchWithFallback(
    () => API.get("/feedback"),
    async () => getStorageData("feedback")
  );
};

export const addFeedback = async (data) => {
  return fetchWithFallback(
    () => API.post("/feedback", data),
    async () => {
      const feedbackList = getStorageData("feedback");
      const newItem = { id: Date.now(), date: new Date().toISOString().split("T")[0], ...data };
      feedbackList.push(newItem);
      saveStorageData("feedback", feedbackList);
      return newItem;
    }
  );
};

export const respondFeedback = async (id, responseText) => {
  return fetchWithFallback(
    () => API.put(`/feedback/${id}/response`, responseText),
    async () => {
      let feedbackList = getStorageData("feedback");
      feedbackList = feedbackList.map((f) => (f.id === Number(id) ? { ...f, response: responseText } : f));
      saveStorageData("feedback", feedbackList);
      return { success: true };
    }
  );
};

export const deleteFeedback = async (id) => {
  return fetchWithFallback(
    () => API.delete(`/feedback/${id}`),
    async () => {
      let feedbackList = getStorageData("feedback");
      feedbackList = feedbackList.filter((f) => f.id !== Number(id));
      saveStorageData("feedback", feedbackList);
      return { success: true };
    }
  );
};

export default API;