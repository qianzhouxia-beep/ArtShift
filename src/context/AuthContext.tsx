import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://artshift-backend.zeabur.app/api';

interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<{ ok: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount: verify stored token
  useEffect(() => {
    const stored = localStorage.getItem('artshift_token');
    if (!stored) { setLoading(false); return; }

    fetch(`${API_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${stored}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
          setToken(stored);
          // Refresh stored user data
          const storedUser = localStorage.getItem('artshift_user');
          if (storedUser) {
            try {
              const u = JSON.parse(storedUser);
              data.user.name = data.user.name || u.fullName || u.name || '';
            } catch {}
          }
          localStorage.setItem('artshift_user', JSON.stringify(data.user));
          // Fetch profile with credits
          return fetch(`${API_URL}/api/me`, {
            headers: { Authorization: `Bearer ${stored}` },
          });
        } else {
          localStorage.removeItem('artshift_token');
          localStorage.removeItem('artshift_user');
        }
        return null;
      })
      .then((res) => res?.json())
      .then((profile) => {
        if (profile?.user) setUser(profile.user);
      })
      .catch(() => {
        localStorage.removeItem('artshift_token');
        localStorage.removeItem('artshift_user');
      })
      .finally(() => setLoading(false));
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.error || 'Signup failed' };

      localStorage.setItem('artshift_token', data.session.access_token);
      localStorage.setItem('artshift_user', JSON.stringify(data.user));
      setToken(data.session.access_token);
      setUser({ ...data.user, credits: 0 });
      return { ok: true };
    } catch {
      return { ok: false, error: 'Network error' };
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.error || 'Login failed' };

      localStorage.setItem('artshift_token', data.session.access_token);
      localStorage.setItem('artshift_user', JSON.stringify(data.user));
      setToken(data.session.access_token);
      setUser({ ...data.user, credits: 0 });

      // Fetch profile with credits
      const pRes = await fetch(`${API_URL}/api/me`, {
        headers: { Authorization: `Bearer ${data.session.access_token}` },
      });
      if (pRes.ok) {
        const pData = await pRes.json();
        if (pData.user) setUser(pData.user);
      }
      return { ok: true };
    } catch {
      return { ok: false, error: 'Network error' };
    }
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    localStorage.removeItem('artshift_token');
    localStorage.removeItem('artshift_user');
    setUser(null);
    setToken(null);
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
