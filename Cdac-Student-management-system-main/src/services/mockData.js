// Initial mock data store with LocalStorage persistence

const initialData = {
  students: [
    { id: 1, name: "Rahul Sharma", email: "rahul.s@cdac.in", course: "PGCP-AC", rollNo: "PGCP-AC-2026-001", batch: "Feb 2026" },
    { id: 2, name: "Priya Patel", email: "priya.p@cdac.in", course: "PGCP-AC", rollNo: "PGCP-AC-2026-002", batch: "Feb 2026" },
    { id: 3, name: "Amit Kumar", email: "amit.k@cdac.in", course: "PGCP-ESD", rollNo: "PGCP-ESD-2026-015", batch: "Feb 2026" },
    { id: 4, name: "Neha Verma", email: "neha.v@cdac.in", course: "PGCP-ITISS", rollNo: "PGCP-ITISS-2026-008", batch: "Feb 2026" },
    { id: 5, name: "Siddharth Joshi", email: "sid.j@cdac.in", course: "PGCP-BDA", rollNo: "PGCP-BDA-2026-024", batch: "Feb 2026" },
    { id: 6, name: "Ananya Roy", email: "ananya.r@cdac.in", course: "PGCP-AI", rollNo: "PGCP-AI-2026-009", batch: "Feb 2026" },
    { id: 7, name: "Vicky Mehra", email: "vicky.m@cdac.in", course: "PGCP-VLSI", rollNo: "PGCP-VLSI-2026-011", batch: "Feb 2026" },
    { id: 8, name: "Pooja Hegde", email: "pooja.h@cdac.in", course: "PGCP-MC", rollNo: "PGCP-MC-2026-003", batch: "Feb 2026" }
  ],
  marks: [
    { id: 1, studentId: "PGCP-AC-2026-001", studentName: "Rahul Sharma", subject: "OOP with Java", score: 88, maxScore: 100, examDate: "2026-03-15" },
    { id: 2, studentId: "PGCP-AC-2026-001", studentName: "Rahul Sharma", subject: "Database Technologies", score: 82, maxScore: 100, examDate: "2026-03-18" },
    { id: 3, studentId: "PGCP-AC-2026-001", studentName: "Rahul Sharma", subject: "Web Programming", score: 91, maxScore: 100, examDate: "2026-03-22" },
    { id: 4, studentId: "PGCP-AC-2026-002", studentName: "Priya Patel", subject: "OOP with Java", score: 94, maxScore: 100, examDate: "2026-03-15" },
    { id: 5, studentId: "PGCP-AC-2026-002", studentName: "Priya Patel", subject: "Database Technologies", score: 89, maxScore: 100, examDate: "2026-03-18" }
  ],
  attendance: [
    { id: 1, date: "2026-03-28", subject: "OOP with Java", totalStudents: 45, presentCount: 42, status: "Completed" },
    { id: 2, date: "2026-03-29", subject: "Web Programming", totalStudents: 45, presentCount: 40, status: "Completed" },
    { id: 3, date: "2026-03-30", subject: "Database Technologies", totalStudents: 45, presentCount: 44, status: "Completed" }
  ],
  placements: [
    { id: 1, company: "TCS Innovation Labs", role: "Software Engineer", package: "₹ 7.5 LPA", location: "Pune / Hyderabad", eligibility: "PGCP-AC / PGCP-ESD min 60%", date: "2026-04-10", status: "Active" },
    { id: 2, company: "Infosys Ltd", role: "Specialist Programmer", package: "₹ 9.5 LPA", location: "Bangalore", eligibility: "PGCP-AC min 65%", date: "2026-04-12", status: "Active" },
    { id: 3, company: "CDAC R&D", role: "Project Engineer", package: "₹ 6.8 LPA", location: "Pune", eligibility: "All PGCP Courses", date: "2026-04-15", status: "Upcoming" },
    { id: 4, company: "Persistent Systems", role: "Module Lead Trainee", package: "₹ 8.0 LPA", location: "Pune", eligibility: "PGCP-AC / PGCP-ITISS / PGCP-BDA", date: "2026-04-18", status: "Active" }
  ],
  assignments: [
    { id: 1, title: "Spring Boot REST API Development", subject: "Spring Boot", dueDate: "2026-04-05", description: "Create a complete RESTful API for Student Management System using Spring Boot & JPA.", status: "Pending" },
    { id: 2, title: "React Component & State Management", subject: "React", dueDate: "2026-04-08", description: "Build a responsive React application featuring Context API and React Router.", status: "Submitted" },
    { id: 3, title: "SQL Complex Joins & Stored Procedures", subject: "Database Technologies", dueDate: "2026-04-12", description: "Write stored procedures and view scripts for complex database transactions.", status: "Pending" }
  ],
  notifications: [
    { id: 1, title: "C-DAC ACTS End-Module Exam Schedule", category: "Exam", message: "End-module examination dates for PGCP batches have been announced. Check portal date-sheet.", date: "2026-03-25", eventDate: "2026-04-10", priority: "High" },
    { id: 2, title: "Campus Placement Registration Open", category: "Placement", message: "Eligible students must register for TCS & Infosys placement drives before April 5th.", date: "2026-03-27", eventDate: "2026-04-05", priority: "High" },
    { id: 3, title: "Guest Lecture on Cloud Native & Microservices", category: "Event", message: "Join the online webinar by Industry Experts this Saturday at 10:00 AM.", date: "2026-03-29", eventDate: "2026-04-12", priority: "Medium" }
  ],
  feedback: [
    { id: 1, subject: "OOP with Java", faculty: "Prof. S. R. Kulkarni", rating: 5, comments: "Excellent hands-on coding demonstrations and deep explanation of concepts.", date: "2026-03-20" },
    { id: 2, subject: "Web Programming", faculty: "Dr. A. Mehra", rating: 4, comments: "Very clear explanation of React hooks and modern JavaScript.", date: "2026-03-22" }
  ]
};

export const getStorageData = (key) => {
  try {
    const item = localStorage.getItem(`cdac_${key}`);
    if (item) return JSON.parse(item);
    localStorage.setItem(`cdac_${key}`, JSON.stringify(initialData[key]));
    return initialData[key];
  } catch (e) {
    return initialData[key] || [];
  }
};

export const saveStorageData = (key, data) => {
  try {
    localStorage.setItem(`cdac_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving mock data", e);
  }
};
