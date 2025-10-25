// app/context/authContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "../models";
import { getLoggedUser } from "../../services/authService";

interface AuthContextType {
  user: User | null;
  setUser: (u: User | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const loggedUser = await getLoggedUser();
      setUser(loggedUser);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return null; // splash screen opcional

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
