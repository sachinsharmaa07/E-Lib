// ============================================================================
// AUTH CONTEXT - GLOBAL AUTHENTICATION STATE MANAGEMENT
// ============================================================================
// CONCEPT: React Context API for managing user authentication state
// - Centralizes auth logic for all components to access

import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

// CONCEPT: Context Creation
// - createContext: Creates a Context object for sharing auth state
const AuthContext = createContext();

// CONCEPT: Context Provider Component
// - Wraps app with auth state and functions
// - All children can access auth data via useAuth hook
export const AuthProvider = ({ children }) => {
  // CONCEPT: State Management
  // - user: Current authenticated user object (null if not logged in)
  // - loading: Boolean to track if auth check is in progress
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // CONCEPT: Persistent Authentication
  // - useEffect: Runs once on component mount
  // - Checks localStorage for stored user session
  // - Restores user session if available (prevents login on page refresh)
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  // CONCEPT: Login Function
  // - Sends credentials to backend API
  // - Stores user data in state and localStorage
  // - localStorage persists session across page reloads
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setUser(res.data.user);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data;
  };

  // CONCEPT: Register Function
  // - Creates new user account via API
  // - Auto-logs in user after successful registration
  // - Stores user session for immediate app access
  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    setUser(res.data.user);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data;
  };

  // CONCEPT: Logout Function
  // - Clears user from state and localStorage
  // - Removes all session data on logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // CONCEPT: Provider Value Object
  // - Exposes auth state and functions to all child components
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// CONCEPT: Custom Hook - useAuth
// - Convenience hook to access auth context
// - Components import useAuth instead of using useContext directly
// - useContext(AuthContext): Retrieves current context value
export const useAuth = () => useContext(AuthContext);
