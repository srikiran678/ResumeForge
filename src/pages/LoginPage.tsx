import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Sun, Moon, Laptop, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { GoogleIcon } from '../components/common/GoogleIcon';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle, authError, clearAuthError } = useAuth();
  const { theme, actualTheme, toggleTheme } = useTheme();

  const [mode, setMode] = useState<'signin' | 'signup'>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === 'signup' ? 'signup' : 'signin';
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const m = params.get('mode');
    if (m === 'signup' || m === 'signin') {
      setMode(m);
    }
  }, [location.search]);
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

  const fillDemoCredentials = () => {
    setEmail('demo@resumeforge.internal');
    setPassword('demo123456');
  };

  const activeError = error || authError;

  return (
    <div className="min-h-dvh relative overflow-hidden flex flex-col items-center justify-center px-4 py-8 sm:py-12 bg-slate-50 dark:bg-[#06080e] transition-colors duration-200">
      {/* 1. Geometric Blueprint Grid with Soft Radial Vignette Mask */}
      <div className="absolute inset-0 bg-grid-pattern mask-radial-faded pointer-events-none opacity-70 dark:opacity-50" />
      <div className="absolute inset-0 bg-dots-pattern mask-radial-faded pointer-events-none opacity-40 dark:opacity-30" />

      {/* 2. Luminescent Horizon Light Beam across top edge */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 dark:via-indigo-400/60 to-transparent pointer-events-none" />

      {/* 3. Smooth Floating Ambient Aurora Orbs */}
      <motion.div
        animate={{
          x: [0, 35, -25, 0],
          y: [0, -25, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 -left-32 w-80 h-80 sm:w-[520px] sm:h-[520px] rounded-full bg-gradient-to-br from-indigo-500/25 via-purple-600/20 to-transparent blur-3xl pointer-events-none"
      />

      <motion.div
        animate={{
          x: [0, -35, 25, 0],
          y: [0, 30, -20, 0],
          scale: [1, 0.95, 1.08, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-36 -right-36 w-80 h-80 sm:w-[540px] sm:h-[540px] rounded-full bg-gradient-to-tl from-emerald-500/20 via-teal-500/15 to-transparent blur-3xl pointer-events-none"
      />

      {/* 4. Center Ambient Glow Behind Glass Card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-indigo-500/12 via-purple-500/8 to-cyan-500/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Top right theme toggle for compact access on all devices */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleTheme}
          title={`Current theme: ${actualTheme}. Click to toggle.`}
          aria-label="Toggle theme mode"
          className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white/80 dark:bg-[#0c101b]/80 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
        >
          {theme === 'system' ? (
            <Laptop className="w-4 h-4 text-indigo-500" />
          ) : actualTheme === 'dark' ? (
            <Moon className="w-4 h-4 text-indigo-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
        </button>
      </div>

      {/* Main Glassmorphic Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative max-w-md w-full bg-white/90 dark:bg-[#0c101d]/90 backdrop-blur-2xl rounded-3xl border border-slate-200/90 dark:border-white/[0.09] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.03)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.08)] p-6 sm:p-8 text-left transition-all"
      >
        {/* Iridescent top highlight border */}
        <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-indigo-500/60 dark:via-indigo-400/70 to-transparent" />

        {/* Clean Logo Header */}
        <div className="text-center mb-6">
          {/* Trust Status Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50/90 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold mb-3.5 shadow-2xs backdrop-blur-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Free ATS Career Workspace</span>
          </div>

          <div className="relative inline-block mb-2">
            <div className="size-12 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 dark:from-indigo-600 dark:to-indigo-900 border border-slate-700/30 text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-md">
              RF
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-950 dark:text-white tracking-tight text-balance">ResumeForge</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium text-pretty">
            {mode === 'signin' ? 'Sign in to access your career workspace' : 'Create your free ATS-first account'}
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
              aria-label="Dismiss error alert"
              className="text-rose-500 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-200 text-sm font-bold ml-1 cursor-pointer"
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
          className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all shadow-2xs flex items-center justify-center space-x-2.5 disabled:opacity-50 cursor-pointer"
        >
          <GoogleIcon className="w-4 h-4" />
          <span>{loading ? 'Connecting to InsForge...' : 'Continue with Google'}</span>
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white/90 dark:bg-[#0c101d] text-slate-400 dark:text-slate-500 font-medium">
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
            className={`flex-1 py-2 text-xs font-bold border-b-2 text-center transition-colors cursor-pointer ${
              mode === 'signin'
                ? 'border-indigo-600 dark:border-indigo-400 text-slate-950 dark:text-white'
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
            className={`flex-1 py-2 text-xs font-bold border-b-2 text-center transition-colors cursor-pointer ${
              mode === 'signup'
                ? 'border-indigo-600 dark:border-indigo-400 text-slate-950 dark:text-white'
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
                className="w-full text-xs p-2.5 border border-slate-300 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  ⚡ Fill demo
                </button>
              )}
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@university.edu"
              className="w-full text-xs p-2.5 border border-slate-300 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
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
              className="w-full text-xs p-2.5 border border-slate-300 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-xs font-bold bg-slate-950 hover:bg-slate-850 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl transition-all shadow-xs hover:shadow-indigo-500/25 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Processing...' : mode === 'signin' ? 'Sign In to Workspace' : 'Create Free Account'}
          </button>
        </form>

        <p className="mt-5 text-center text-[11px] text-slate-400 dark:text-slate-500">
          No credit card required. No hidden fees. Zero paywalls ever.
        </p>
      </motion.div>

      {/* Trust & Guarantee Badges beneath card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 text-center"
      >
        <span className="flex items-center space-x-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Real Selectable Vector PDF</span>
        </span>
        <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
        <span className="flex items-center space-x-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span>Top-to-Bottom ATS Reading Order</span>
        </span>
        <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
        <span className="flex items-center space-x-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
          <span>Master Profile Sync</span>
        </span>
      </motion.div>
    </div>
  );
};
