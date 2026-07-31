import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// 🔐 Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ================= AUTH =================
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

// ================= STUDENTS =================
export const getStudents = () => API.get("/students");
export const addStudent = (data) => API.post("/students", data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);

// ================= MARKS =================
export const getMarks = () => API.get("/marks");

export default API;