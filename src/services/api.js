import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// STUDENTS
export const getStudents = () => API.get("/students");
export const addStudent = (data) => API.post("/students", data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);

// MARKS
export const getMarks = () => API.get("/marks");

export default API;