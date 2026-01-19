// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { checkLogin, logout } from "../services/apiService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      try {
        await checkLogin();
        setAuthenticated(true);
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    verify();
  }, []);

  async function realizarLogout() {
    try {
      await logout();
    } catch (err) {
      console.error("Erro ao fazer logout no contexto:", err);
    } finally {
     
      setAuthenticated(false);
    }
  }

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, loading, realizarLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
