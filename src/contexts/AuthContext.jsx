/**
 * AuthContext.js (Fixed)
 *
 * This updated AuthContext introduces a `loading` state to prevent
 * premature redirects on page refresh.
 *
 * Key Changes:
 * 1.  Added a `loading` state, initialized to `true`.
 * 2.  The `useEffect` hook now sets `loading` to `false` after it has
 * finished checking localStorage for a user and token.
 * 3.  The `loading` state is now exposed through the context provider's value.
 * This allows other components (like protected routes) to wait for
 * authentication to be resolved before rendering.
 */
import { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  // 1. Add a loading state to track the initial auth check.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(storedUser);
        setToken(storedToken);
        // Set the default authorization header for all subsequent axios requests
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storedToken}`;
      }
    } catch (error) {
      // If there's an error (e.g., malformed JSON), clear storage
      console.error("Error loading auth from storage:", error);
      logout();
    } finally {
      // 2. Set loading to false after the check is complete.
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      setToken(token);

      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      return res.data;
    } catch (error) {
      // It's better to let the component handle the error toast/message
      throw error.response?.data || new Error("Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    delete axiosInstance.defaults.headers.common["Authorization"];
  };

  const authContextValue = {
    user,
    token, // It's good practice to expose the token as well
    loading, // 3. Expose the loading state
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
