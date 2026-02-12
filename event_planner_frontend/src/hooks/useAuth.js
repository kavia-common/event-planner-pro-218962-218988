import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { readSession, writeSession } from "../api/client";
import { login as apiLogin, logout as apiLogout, register as apiRegister } from "../api/auth";

const AuthContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * AuthProvider stores session state and provides login/register/logout actions.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    const s = readSession();
    setUser(s.user);
    setToken(s.token);
    setBootstrapped(true);
  }, []);

  const value = useMemo(() => {
    return {
      user,
      token,
      isAuthenticated: Boolean(token),
      bootstrapped,

      // PUBLIC_INTERFACE
      async login({ email, password }) {
        const res = await apiLogin({ email, password });
        const s = readSession();
        setUser(s.user);
        setToken(s.token);
        return res;
      },

      // PUBLIC_INTERFACE
      async register({ name, email, password }) {
        const res = await apiRegister({ name, email, password });
        const s = readSession();
        setUser(s.user);
        setToken(s.token);
        return res;
      },

      // PUBLIC_INTERFACE
      logout() {
        apiLogout();
        writeSession({ token: null, user: null });
        setUser(null);
        setToken(null);
      },
    };
  }, [user, token, bootstrapped]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * useAuth provides access to auth state and actions.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
