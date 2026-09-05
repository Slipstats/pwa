"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Profile } from "@/types/database.types";
import { getCurrentUserAction, logoutAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: { id: string; email?: string; full_name?: string } | null;
  profile: Profile | null;
  isConfigured: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isConfigured: false,
  isLoading: true,
  logout: async () => {},
  refreshAuth: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ id: string; email?: string; full_name?: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const loadUser = async () => {
    try {
      const data = await getCurrentUserAction();
      setUser(data.user);
      setProfile(data.profile);
      setIsConfigured(data.isConfigured);
    } catch (e) {
      console.error("Auth state error", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const logout = async () => {
    await logoutAction();
    setUser(null);
    setProfile(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isConfigured,
        isLoading,
        logout,
        refreshAuth: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
