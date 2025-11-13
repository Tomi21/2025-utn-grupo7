// app/context/authContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "../models";
import { getLoggedUser, logoutUser } from "../../services/authService";
import { useRouter } from "expo-router";

interface AuthContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const loggedUser = await getLoggedUser();
      setUser(loggedUser);
      setLoading(false);
    };
    fetchUser();
  }, []);

  // 🔹 Cierra sesión completamente
  const logout = async () => {
    try {
      await logoutUser(); // borra sesión de Firebase
      setUser(null); // limpia el contexto
      router.replace("/auth"); // vuelve al login
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (loading) return null; // opcional: podés mostrar un Splash aquí

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
