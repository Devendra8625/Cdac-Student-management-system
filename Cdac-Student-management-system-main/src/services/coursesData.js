// Centralized C-DAC PGCP Course Catalog & Modules Data

export const COURSES_DATA = [
  {
    id: 1,
    code: "PGCP-AC",
    name: "Advanced Computing",
    fullTitle: "PG Course in Advanced Computing (PGCP-AC)",
    duration: "6 Months",
    modulesCount: 13,
    modules: [
      "C Programming",
      "Data Structures & Algorithms",
      "OOP with Java",
      "Web Programming",
      "Database Technologies",
      ".NET",
      "Java Enterprise Technologies",
      "Spring Boot",
      "Microservices",
      "React",
      "DevOps",
      "Aptitude",
      "Project"
    ]
  },
  {
    id: 2,
    code: "PGCP-BDA",
    name: "Big Data Analytics",
    fullTitle: "PG Course in Big Data Analytics (PGCP-BDA)",
    duration: "6 Months",
    modulesCount: 11,
    modules: [
      "Python",
      "SQL",
      "Statistics",
      "Machine Learning",
      "Hadoop",
      "Spark",
      "Kafka",
      "Data Visualization",
      "Deep Learning",
      "Data Engineering",
      "Project"
    ]
  },
  {
    id: 3,
    code: "PGCP-AI",
    name: "Artificial Intelligence",
    fullTitle: "PG Course in Artificial Intelligence (PGCP-AI)",
    duration: "6 Months",
    modulesCount: 10,
    modules: [
      "Python",
      "Mathematics for AI",
      "Machine Learning",
      "Deep Learning",
      "NLP",
      "Computer Vision",
      "Generative AI",
      "MLOps",
      "TensorFlow/PyTorch",
      "Project"
    ]
  },
  {
    id: 4,
    code: "PGCP-ESD",
    name: "Embedded Systems Design",
    fullTitle: "PG Course in Embedded Systems Design (PGCP-ESD)",
    duration: "6 Months",
    modulesCount: 9,
    modules: [
      "C/C++",
      "Embedded C",
      "ARM Programming",
      "RTOS",
      "Linux Device Drivers",
      "IoT",
      "Embedded Linux",
      "PCB Basics",
      "Project"
    ]
  },
  {
    id: 5,
    code: "PGCP-ITISS",
    name: "IT Infrastructure, Systems & Security",
    fullTitle: "PG Course in IT Infrastructure, Systems & Security (PGCP-ITISS)",
    duration: "6 Months",
    modulesCount: 9,
    modules: [
      "Linux Administration",
      "Windows Server",
      "Networking",
      "Virtualization",
      "Cloud Computing",
      "Cyber Security",
      "Ethical Hacking",
      "Firewalls",
      "Project"
    ]
  },
  {
    id: 6,
    code: "PGCP-VLSI",
    name: "VLSI Design",
    fullTitle: "PG Course in VLSI Design (PGCP-VLSI)",
    duration: "6 Months",
    modulesCount: 9,
    modules: [
      "Digital Electronics",
      "Verilog HDL",
      "SystemVerilog",
      "FPGA",
      "CMOS Design",
      "Physical Design",
      "ASIC Flow",
      "STA",
      "Project"
    ]
  },
  {
    id: 7,
    code: "PGCP-MC",
    name: "Mobile Computing",
    fullTitle: "PG Course in Mobile Computing (PGCP-MC)",
    duration: "6 Months",
    modulesCount: 7,
    modules: [
      "Java/Kotlin",
      "Android Development",
      "REST APIs",
      "Flutter Basics",
      "Firebase",
      "Mobile Security",
      "Project"
    ]
  },
  {
    id: 8,
    code: "PGCP-ASSD",
    name: "Advanced Secure Software Development",
    fullTitle: "PG Course in Advanced Secure Software Development (PGCP-ASSD)",
    duration: "6 Months",
    modulesCount: 8,
    modules: [
      "Secure Coding",
      "Java Enterprise",
      "OWASP",
      "DevSecOps",
      "Cryptography",
      "Penetration Testing",
      "Secure API Development",
      "Project"
    ]
  },
  {
    id: 9,
    code: "PGCP-RAT",
    name: "Robotics & Allied Technologies",
    fullTitle: "PG Course in Robotics & Allied Technologies (PGCP-RAT)",
    duration: "6 Months",
    modulesCount: 7,
    modules: [
      "Robotics Fundamentals",
      "ROS",
      "Embedded Systems",
      "AI for Robotics",
      "Sensors & Actuators",
      "Computer Vision",
      "Project"
    ]
  },
  {
    id: 10,
    code: "PGCP-HPCSA",
    name: "HPC System Administration",
    fullTitle: "PG Course in HPC System Administration (PGCP-HPCSA)",
    duration: "6 Months",
    modulesCount: 8,
    modules: [
      "Linux",
      "Cluster Computing",
      "Networking",
      "MPI/OpenMP",
      "GPU Computing",
      "HPC Administration",
      "Storage Systems",
      "Project"
    ]
  },
  {
    id: 11,
    code: "PGCP-FBD",
    name: "FinTech & Blockchain Development",
    fullTitle: "PG Course in FinTech & Blockchain Development (PGCP-FBD)",
    duration: "6 Months",
    modulesCount: 9,
    modules: [
      "Java",
      "MERN Stack",
      "Blockchain",
      "Solidity",
      "Ethereum",
      "Smart Contracts",
      "Cryptography",
      "Digital Payments",
      "Project"
    ]
  },
  {
    id: 12,
    code: "PGCP-CSF",
    name: "Cyber Security & Forensics",
    fullTitle: "PG Course in Cyber Security & Forensics (PGCP-CSF)",
    duration: "6 Months",
    modulesCount: 8,
    modules: [
      "Ethical Hacking",
      "Network Security",
      "Digital Forensics",
      "Malware Analysis",
      "Incident Response",
      "Cloud Security",
      "SIEM",
      "Project"
    ]
  }
];

// Helper to get formatted API course objects
export const getFormattedCourses = () => {
  return COURSES_DATA.map((c) => ({
    id: c.id,
    name: c.fullTitle,
    code: c.code,
    duration: c.duration,
    modules: c.modulesCount,
    modulesList: c.modules.join(", ")
  }));
};

// Helper to get all modules across all courses
export const getAllModules = () => {
  const allMods = new Set();
  COURSES_DATA.forEach((c) => {
    c.modules.forEach((m) => allMods.add(m));
  });
  return Array.from(allMods);
};

// Helper to get modules for a given course code
export const getModulesForCourse = (courseCode) => {
  if (!courseCode || courseCode === "All") {
    return getAllModules();
  }
  const course = COURSES_DATA.find(
    (c) => c.code.toLowerCase() === courseCode.toLowerCase() ||
           courseCode.toLowerCase().includes(c.code.toLowerCase()) ||
           (c.code === "PGCP-AC" && courseCode === "DAC") ||
           (c.code === "PGCP-ESD" && courseCode === "DESD") ||
           (c.code === "PGCP-ITISS" && courseCode === "DITISS") ||
           (c.code === "PGCP-BDA" && courseCode === "DBDA")
  );
  return course ? course.modules : getAllModules();
};

// Course Badge Color Map
export const getCourseBadgeStyle = (code) => {
  const map = {
    "PGCP-AC": { bg: "#dbeafe", color: "#1e40af" },
    "PGCP-BDA": { bg: "#fef3c7", color: "#92400e" },
    "PGCP-AI": { bg: "#f3e8ff", color: "#6b21a8" },
    "PGCP-ESD": { bg: "#e0e7ff", color: "#3730a3" },
    "PGCP-ITISS": { bg: "#dcfce7", color: "#166534" },
    "PGCP-VLSI": { bg: "#ffedd5", color: "#9a3412" },
    "PGCP-MC": { bg: "#e0f2fe", color: "#075985" },
    "PGCP-ASSD": { bg: "#ffe4e6", color: "#9f1239" },
    "PGCP-RAT": { bg: "#fae8ff", color: "#86198f" },
    "PGCP-HPCSA": { bg: "#ccfbf1", color: "#115e59" },
    "PGCP-FBD": { bg: "#fef08a", color: "#854d0e" },
    "PGCP-CSF": { bg: "#fee2e2", color: "#991b1b" },
    "DAC": { bg: "#dbeafe", color: "#1e40af" },
    "DESD": { bg: "#e0e7ff", color: "#3730a3" },
    "DITISS": { bg: "#dcfce7", color: "#166534" },
    "DBDA": { bg: "#fef3c7", color: "#92400e" }
  };
  return map[code] || { bg: "#f1f5f9", color: "#475569" };
};
