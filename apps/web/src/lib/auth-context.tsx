'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api, clearToken, getToken, setToken, USER_KEY } from './api';
import type { AuthUser } from './types';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ user: AuthUser | null; isLoading: boolean }>({
    user: null,
    isLoading: true,
  });
  const router = useRouter();

  useEffect(() => {
    // One-time hydration from storage on mount — unavailable during SSR,
    // so there's no synchronous alternative to reading it in an effect.
    const token = getToken();
    const storedUser = localStorage.getItem(USER_KEY) ?? sessionStorage.getItem(USER_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({
      user: token && storedUser ? (JSON.parse(storedUser) as AuthUser) : null,
      isLoading: false,
    });
  }, []);

  async function login(email: string, password: string, remember = true) {
    const { accessToken, user: loggedInUser } = await api.login(email, password);
    setToken(accessToken, remember);
    (remember ? localStorage : sessionStorage).setItem(USER_KEY, JSON.stringify(loggedInUser));
    setState({ user: loggedInUser, isLoading: false });
    router.push('/dashboard');
  }

  function logout() {
    clearToken();
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
    setState({ user: null, isLoading: false });
    router.push('/login');
  }

  return (
    <AuthContext.Provider value={{ user: state.user, isLoading: state.isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
