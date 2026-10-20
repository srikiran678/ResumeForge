import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, Sun, Moon, Laptop } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { GoogleIcon } from '../components/common/GoogleIcon';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle, authError, clearAuthError } = useAuth();
  const { theme, actualTheme, setTheme, toggleTheme } = useTheme();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get('error');
    const desc = params.get('error_description');
    if (err) {
      return err === 'access_denied'
        ? 'Google sign-in was cancelled or access was denied.'
        : desc || err;
    }
    return null;
  });

  const destination = (location.state as any)?.from?.pathname || '/dashboard';

  // If already authenticated, redirect away from login
  useEffect(() => {
    if (user) {
      navigate(destination, { replace: true });
    }
  }, [user, navigate, destination]);

  // Read OAuth callback errors from URL query parameters (e.g. ?error=access_denied)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const err = params.get('error');
    const desc = params.get('error_description');
    if (err) {
      setError(
        err === 'access_denied'
          ? 'Google sign-in was cancelled or access was denied.'
          : desc || err
      );
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    clearAuthError();

    if (mode === 'signup') {
      const res = await signUpWithEmail(email, fullName, password);
      if (res.error) {
        setError(res.error);
      } else {
        navigate(destination);
      }
    } else {
      const res = await signInWithEmail(email, password);
      if (res.error) {
        setError(res.error);
      } else {
        navigate(destination);
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    clearAuthError();
    const res = await signInWithGoogle();
    if (res.error) {
      setError(res.error);
      setLoading(false);
    }
  };

  const activeError = error || authError;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:py-12 bg-slate-50 dark:bg-slate-950 transition-colors duration-150">
      {/* Top right theme toggle for compact access on all devices */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleTheme}
          title={`Current theme: ${actualTheme}. Click to toggle.`}
          aria-label="Toggle theme mode"
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors"
        >
          {theme === 'system' ? (
            <Laptop className="w-4 h-4 text-accent-500" />
          ) : actualTheme === 'dark' ? (
            <Moon className="w-4 h-4 text-indigo-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
        </button>
      </div>

      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 text-left transition-colors duration-150">
        {/* Clean Logo Header - No features displayed */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-slate-950 dark:bg-slate-800 border border-transparent dark:border-slate-700 text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-3 shadow-md">
            RF
          </div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-white tracking-tight">ResumeForge</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {mode === 'signin' ? 'Sign in to access your workspace' : 'Create your free ATS-first account'}
          </p>
        </div>

        {activeError && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{activeError}</div>
            <button
              onClick={() => {
                setError(null);
                clearAuthError();
              }}
              className="text-rose-500 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-200 text-sm font-bold ml-1"
            >
              ×
            </button>
          </div>
        )}

        {message && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
            {message}
          </div>
        )}

        {/* 1. Google OAuth Primary Option */}
        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleLogin}
          className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all shadow-2xs flex items-center justify-center space-x-2.5 disabled:opacity-50"
        >
          <GoogleIcon className="w-4 h-4" />
          <span>{loading ? 'Connecting to InsForge...' : 'Continue with Google'}</span>
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 font-medium">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-4">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError(null);
              clearAuthError();
            }}
            className={`flex-1 py-2 text-xs font-bold border-b-2 text-center transition-colors ${
              mode === 'signin'
                ? 'border-slate-950 dark:border-emerald-500 text-slate-950 dark:text-white'
                : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
              clearAuthError();
            }}
            className={`flex-1 py-2 text-xs font-bold border-b-2 text-center transition-colors ${
              mode === 'signup'
                ? 'border-slate-950 dark:border-emerald-500 text-slate-950 dark:text-white'
                : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Create Free Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full text-xs p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@university.edu"
              className="w-full text-xs p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password {mode === 'signin' && <span className="font-normal text-slate-400 dark:text-slate-500">(Optional for instant test)</span>}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              className="w-full text-xs p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-xs font-bold bg-slate-950 dark:bg-emerald-600 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'Processing...' : mode === 'signin' ? 'Sign In to Workspace' : 'Create Free Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-slate-400 dark:text-slate-500">
          No credit card required. No hidden fees. Zero paywalls ever.
        </p>
      </div>
    </div>
  );
};
