"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ORGANIZER" | "ADMIN";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => Promise<{ error?: string }>;
  logout: () => void;
  isOrganizer: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({}),
  register: async () => ({}),
  logout: () => {},
  isOrganizer: false,
  isAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("kefa_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || "Erreur de connexion" };
    localStorage.setItem("kefa_user", JSON.stringify(data));
    setUser(data);
    return {};
  }, []);

  const register = useCallback(
    async (formData: {
      name: string;
      email: string;
      password: string;
      role: string;
    }) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || "Erreur d'inscription" };
      localStorage.setItem("kefa_user", JSON.stringify(data));
      setUser(data);
      return {};
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("kefa_user");
    setUser(null);
    window.location.href = "/";
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isOrganizer: user?.role === "ORGANIZER" || user?.role === "ADMIN",
        isAdmin: user?.role === "ADMIN",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
