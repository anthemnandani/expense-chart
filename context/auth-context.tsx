"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Users } from "@/lib/types";

interface AuthContextType {
  user: Users | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setUser: (user: Users | null) => void;
  signOut: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Users | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/user", { credentials: "include" });
      const data = await res.json();

      if (res.ok && data.user) {
        setUser(data.user);
      } else {
        console.warn("User not found or invalid:", data.error || "Unknown error");
        setUser(null);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

 const signOut = async () => {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    console.log("clicked on sinout");
    router.push("/signin");
  } catch (err) {
    console.error("Sign out error:", err);
  }
};

  return (
    <AuthContext.Provider value={{ user, loading, setLoading, setUser, signOut, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
