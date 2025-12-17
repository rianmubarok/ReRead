"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Address, User } from "@/types/user";
import { authService } from "@/services/auth.service";
import { loginWithGoogleFirebase } from "@/services/auth.firebase.client";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (name: string, avatar: string, address: Address) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check session (reads from localStorage in dev mode)
        const userData = await authService.checkSession();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (name: string, avatar: string, address: Address) => {
    setIsLoading(true);
    try {
      // authService.login now handles localStorage and Supabase internally
      const uid = user?.uid;
      const email = user?.email;
      const userData = await authService.login(name, avatar, address, email, uid);
      setUser(userData);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      let userData = await loginWithGoogleFirebase();

      // Sync with Supabase: Check if this user actually exists in DB with more data
      // (e.g. returning user on new device)
      const syncedUser = await authService.checkSession();
      if (syncedUser) {
        userData = syncedUser;
      }

      setUser(userData);
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // authService.logout now handles localStorage internally
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      const updatedUser = await authService.updateProfile(updates);
      if (updatedUser) {
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Update user failed:", error);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithGoogle,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
