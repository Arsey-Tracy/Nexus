/** @format */

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/api/auth";
import { setAuthToken } from "@/lib/api/api";

type User = any;

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const storedToken =
          localStorage.getItem("token") || localStorage.getItem("access");
        const storedUser = localStorage.getItem("user");

        if (storedToken) {
          // make sure our api client uses this token
          setAuthToken(storedToken);
          setToken(storedToken);
        }

        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setLoading(false);
          return;
        }

        // if token exists but no stored user, try to fetch current user
        if (storedToken) {
          try {
            const res = await getCurrentUser(); // should return { user, profile, ... } or user object
            // backend in your setup returns { user, profile } — handle both shapes
            const fetchedUser = res?.user ?? res;
            if (fetchedUser) {
              setUser(fetchedUser);
              localStorage.setItem("user", JSON.stringify(fetchedUser));
            }
          } catch (err) {
            // token invalid or expired: clear it
            localStorage.removeItem("access");
            localStorage.removeItem("token");
            setAuthToken(null);
            setToken(null);
            setUser(null);
          }
        }
      } catch (e) {
        console.warn("Auth init failed", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = (userObj: User, tokenStr: string) => {
    setUser(userObj);
    setToken(tokenStr);
    setAuthToken(tokenStr);
    try {
      localStorage.setItem("user", JSON.stringify(userObj));
      localStorage.setItem("access", tokenStr);
      localStorage.setItem("token", tokenStr);
    } catch {}
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("access");
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
