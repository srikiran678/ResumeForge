import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Briefcase, 
  Sparkles, 
  Settings, 
  Menu, 
  X,
  LogOut,
  Layers,
  Command,
  Sun,
  Moon,
  Laptop,
  Eye,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useTheme } from '../../context/ThemeContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { aiUsage } = useWorkspace();
  const { theme, actualTheme, setTheme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Layers },
    { to: '/profile', label: 'Default Profile', icon: User },
    { to: '/resumes', label: 'My Resumes', icon: FileText },
    { to: '/applications', label: 'Applications', icon: Briefcase },
    { to: '/ai', label: 'AI Tools', icon: Sparkles },
    { to: '/settings', label: 'Settings', icon: Settings },
    { to: '/portfolio', label: 'Preview', icon: Eye },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white/80 dark:bg-[#08090a]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/[0.07] sticky top-0 z-40 no-print transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2.5 group">
              <div className="size-9 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 dark:from-indigo-600 dark:to-indigo-900 border border-slate-700/30 flex items-center justify-center text-white font-extrabold text-sm shadow-sm group-hover:scale-105 transition-transform">
                RF
              </div>
              <div className="flex items-center">
                <span className="font-extrabold text-lg tracking-tight text-slate-950 dark:text-white font-display">
                  ResumeForge
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800/60 rounded-full">
                  ATS-First
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-1 bg-slate-100/60 dark:bg-white/[0.04] p-1 rounded-xl border border-slate-200/50 dark:border-white/[0.05]">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? 'bg-white dark:bg-[#16171c] text-slate-950 dark:text-white shadow-2xs font-semibold border border-slate-200/60 dark:border-white/[0.08]'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.03]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right Action Icons / User Info */}
          <div className="hidden md:flex items-center space-x-2.5">
            {/* Quick Command Palette trigger */}
            <button
              onClick={() => {
                const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true, bubbles: true });
                window.dispatchEvent(event);
              }}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200/80 dark:border-white/[0.08] bg-slate-50/60 dark:bg-white/[0.03] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] text-xs font-mono transition-colors cursor-pointer"
              title="Command Palette (Cmd+K)"
            >
              <Command className="w-3.5 h-3.5" />
              <span className="text-[10px] tracking-widest font-semibold">K</span>
            </button>

            {/* Dark Mode Toggle */}
            <div className="flex items-center rounded-lg border border-slate-200/80 dark:border-white/[0.08] p-0.5 bg-slate-100/60 dark:bg-white/[0.03]">
              <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  theme === 'light' 
                    ? 'bg-white text-amber-500 shadow-2xs' 
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title="Light Mode"
                aria-label="Switch to light mode"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  theme === 'dark' 
                    ? 'bg-slate-800 text-indigo-400 shadow-2xs' 
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title="Dark Mode"
                aria-label="Switch to dark mode"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  theme === 'system' 
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs' 
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title="Follow System Theme"
                aria-label="Follow system theme"
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
            </div>

            {user ? (
              <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200/80 dark:border-white/[0.08]">
                {/* AI Quota Badge */}
                <div 
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/50 text-[11px] font-mono font-medium text-indigo-700 dark:text-indigo-300"
                  title="Daily AI generation tokens remaining"
                >
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  <span className="tabular-nums">{20 - (aiUsage?.callsUsedToday || 0)}/20 AI</span>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="size-7 rounded-full bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center text-xs font-bold ring-2 ring-white dark:ring-[#08090a] shadow-xs">
                    {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Sign Out"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xs"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => toggleTheme()}
              className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              aria-label="Toggle theme mode"
            >
              {actualTheme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg focus:outline-none cursor-pointer"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 dark:border-white/[0.08] bg-white/95 dark:bg-[#0c101d]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {user ? (
            <>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                      active
                        ? 'bg-slate-100 dark:bg-white/[0.08] text-slate-950 dark:text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              <div className="pt-4 mt-2 border-t border-slate-200 dark:border-white/[0.08] flex justify-between items-center px-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate max-w-[200px]">
                  {user.email}
                </span>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-1.5 text-xs text-rose-600 dark:text-rose-400 font-bold px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 text-center text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04] rounded-lg"
              >
                Log In
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 text-center text-sm font-bold bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-lg shadow-sm"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
