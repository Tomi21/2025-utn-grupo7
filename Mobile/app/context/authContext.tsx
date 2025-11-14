// app/context/authContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../models";
import { getLoggedUser, logoutUser as logoutService } from "../../services/authService";

// --- 1. AÑADIMOS 'setUser' DE VUELTA AL "CONTRATO" ---
interface AuthContextType {
  user: User | null;
  logout: () => Promise<void>; 
  setUser: (u: User | null) => void; // <-- ¡HA VUELTO!
}

// 2. AÑADIMOS 'setUser' AL VALOR POR DEFECTO
export const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: async () => {}, 
  setUser: () => {}, // <-- ¡AÑADIDO!
});

// Hook para consumir el contexto (¡importante!)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null); // <-- 'setUser' real
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const loggedUser = await getLoggedUser();
      setUser(loggedUser);
      setLoading(false);
    };
    fetchUser();
  }, []);

  const logout = async () => {
  console.log("INTENTANDO CERRAR SESIÓN");
  try {
    await logoutService();
    console.log("LOGOUT SERVICE OK, SETEANDO USER NULL");
    setUser(null);
    console.log("USER DESPUÉS DE SETEAR:", user);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

  if (loading) return null; 

  return (
    // --- 3. AÑADIMOS 'setUser' DE VUELTA AL 'value' ---
    <AuthContext.Provider value={{ user, logout, setUser }}> 
      {children}
    </AuthContext.Provider>
  );
}