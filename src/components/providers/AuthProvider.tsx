"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AuthContext } from "@/hooks/useAuth";
import type { UserProfile } from "@/lib/api/types";
import { authService, type LoginCredentials } from "@/services/authService";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const currentUser = await authService.getSession();
      setUser(currentUser);
      return currentUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    authService
      .getSession()
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    function handleUnauthorized() {
      setUser(null);
      setIsLoading(false);
    }

    window.addEventListener("maintenance:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("maintenance:unauthorized", handleUnauthorized);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const session = await authService.login(credentials);
    setUser(session.user);
    return session.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const logoutAll = useCallback(async () => {
    await authService.logoutAll();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      logoutAll,
      refreshSession,
    }),
    [isLoading, login, logout, logoutAll, refreshSession, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
