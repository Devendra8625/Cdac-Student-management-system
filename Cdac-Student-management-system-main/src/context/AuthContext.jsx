import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage on refresh
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (typeof parsed === "object" && parsed !== null) {
          setUser(parsed);
        } else if (typeof parsed === "string") {
          setUser({ name: "User", role: parsed });
        }
      }
    } catch (err) {
      localStorage.removeItem("user");
    }
  }, []);

  const login = (userData, token) => {
    const userObj =
      typeof userData === "string"
        ? { name: token || "User", role: userData }
        : userData;

    setUser(userObj);

    // ✅ Save to localStorage
    localStorage.setItem("user", JSON.stringify(userObj));
    if (token) localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);