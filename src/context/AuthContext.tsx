import React, { createContext, useContext, useState, useEffect } from 'react';
import { insforge, isInsforgeConfigured } from '../lib/insforge';

export interface User {
  id: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signInWithEmail: (email: string, password?: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, fullName: string, password?: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('resumeforge_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(isInsforgeConfigured);
  const [authError, setAuthError] = useState<string | null>(() => {
    try {
      const saved = sessionStorage.getItem('resumeforge_oauth_error');
      if (saved) {
        sessionStorage.removeItem('resumeforge_oauth_error');
        return saved;
      }
    } catch {
      // ignore
    }

    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');
    const errorDesc = params.get('error_description');
    if (errorParam) {
      return errorParam === 'access_denied'
        ? 'Google sign-in was cancelled or access was denied.'
        : errorDesc || errorParam;
    }

    return null;
  });

  const clearAuthError = () => setAuthError(null);

  useEffect(() => {
    // Clean OAuth callback error params from URL history if present
    const params = new URLSearchParams(window.location.search);
    if (params.has('error') || params.has('error_description')) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    // 2. Check InsForge user session on mount
    if (isInsforgeConfigured) {
      insforge.auth
        .getCurrentUser()
        .then(({ data }) => {
          if (data?.user) {
            const authUser: User = {
              id: data.user.id,
              email: data.user.email || '',
              fullName:
                (data.user as any).name ||
                (data.user as any).profile?.name ||
                data.user.email?.split('@')[0] ||
                'Google User',
            };
            setUser(authUser);
            localStorage.setItem('resumeforge_current_user', JSON.stringify(authUser));
          } else {
            // If no remote InsForge session, check if active local user session exists
            const saved = localStorage.getItem('resumeforge_current_user');
            if (saved) {
              try {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.id && parsed.email) {
                  setUser(parsed);
                } else {
                  setUser(null);
                  localStorage.removeItem('resumeforge_current_user');
                }
              } catch {
                setUser(null);
              }
            } else {
              setUser(null);
            }
          }
        })
        .catch((err: unknown) => {
          console.debug('InsForge getCurrentUser error:', err);
        })
        .finally(() => {
          setLoading(false);
        });

      // 3. Listen for InsForge auth changes in real-time
      try {
        const unsubscribe = insforge.auth.onAuthStateChange(async () => {
          try {
            const { data } = await insforge.auth.getCurrentUser();
            if (data?.user) {
              const authUser: User = {
                id: data.user.id,
                email: data.user.email || '',
                fullName:
                  (data.user as any).name ||
                  (data.user as any).profile?.name ||
                  data.user.email?.split('@')[0] ||
                  'Google User',
              };
              setUser(authUser);
              localStorage.setItem('resumeforge_current_user', JSON.stringify(authUser));
            } else {
              setUser(null);
              localStorage.removeItem('resumeforge_current_user');
            }
          } catch (e) {
            console.debug('onAuthStateChange fetch error:', e);
          }
        });
        return () => {
          unsubscribe?.();
        };
      } catch (e) {
        console.debug('onAuthStateChange listener error:', e);
      }
    }
  }, []);

  const signInWithGoogle = async (): Promise<{ error?: string }> => {
    try {
      setLoading(true);
      setAuthError(null);
      const redirectUrl = window.location.origin + '/dashboard';
      const res = await insforge.auth.signInWithOAuth({
        provider: 'google',
        redirectTo: redirectUrl,
      });

      if (res.error) {
        setLoading(false);
        const msg = res.error.message || 'Google OAuth failed to start';
        setAuthError(msg);
        return { error: msg };
      }

      if (res.data?.url) {
        window.location.href = res.data.url;
        return {};
      }

      setLoading(false);
      return {};
    } catch (err: any) {
      setLoading(false);
      const msg = err.message || 'Google OAuth connection failed';
      setAuthError(msg);
      return { error: msg };
    }
  };

  const signInWithEmail = async (email: string, password?: string): Promise<{ error?: string }> => {
    try {
      setLoading(true);
      setAuthError(null);
      if (isInsforgeConfigured && password) {
        const { data, error } = await insforge.auth.signInWithPassword({ email, password });
        if (error) {
          setLoading(false);
          setAuthError(error.message);
          return { error: error.message };
        }
        if (data?.user) {
          const authUser: User = {
            id: data.user.id,
            email: data.user.email || '',
            fullName: (data.user as any).name || email.split('@')[0],
          };
          setUser(authUser);
          localStorage.setItem('resumeforge_current_user', JSON.stringify(authUser));
          setLoading(false);
          return {};
        }
      }

      // Passwordless fallback
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        fullName: email.split('@')[0],
      };
      setUser(newUser);
      localStorage.setItem('resumeforge_current_user', JSON.stringify(newUser));
      setLoading(false);
      return {};
    } catch (err: any) {
      setLoading(false);
      const msg = err.message || 'Email sign-in failed';
      setAuthError(msg);
      return { error: msg };
    }
  };

  const signUpWithEmail = async (email: string, fullName: string, password?: string): Promise<{ error?: string }> => {
    try {
      setLoading(true);
      setAuthError(null);
      if (isInsforgeConfigured) {
        const pwd = password || 'SecureRF2026!';
        const { data, error } = await insforge.auth.signUp({
          email,
          password: pwd,
          name: fullName,
        });
        if (error) {
          setLoading(false);
          setAuthError(error.message);
          return { error: error.message };
        }
        if (data?.user) {
          const authUser: User = {
            id: data.user.id,
            email: data.user.email || email,
            fullName: (data.user as any).profile?.name || (data.user as any).name || fullName,
          };
          setUser(authUser);
          localStorage.setItem('resumeforge_current_user', JSON.stringify(authUser));
          setLoading(false);
          return {};
        }
      }

      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        fullName,
      };
      setUser(newUser);
      localStorage.setItem('resumeforge_current_user', JSON.stringify(newUser));
      setLoading(false);
      return {};
    } catch (err: any) {
      setLoading(false);
      const msg = err.message || 'Sign up failed';
      setAuthError(msg);
      return { error: msg };
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      if (isInsforgeConfigured) {
        await insforge.auth.signOut();
      }
    } catch (e) {
      console.debug('InsForge signOut error:', e);
    }
    setUser(null);
    localStorage.removeItem('resumeforge_current_user');
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        clearAuthError,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
