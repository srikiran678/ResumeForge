import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  User, 
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
  Laptop
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
    { to: '/resumes', label: 'My Resumes', icon: FileText },
    { to: '/applications', label: 'Applications', icon: Briefcase },
    { to: '/ai', label: 'AI Tools', icon: Sparkles },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-forge-200 dark:border-slate-800 sticky top-0 z-40 no-print transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-forge-900 dark:bg-slate-800 border border-transparent dark:border-slate-700 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                RF
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-forge-900 dark:text-white">ResumeForge</span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full">
                  100% Free ATS
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links — ONLY shown if user is authenticated (No features for unauthenticated guests) */}
          {user && (
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-forge-100 dark:bg-slate-800 text-forge-900 dark:text-white font-bold'
                        : 'text-forge-600 dark:text-slate-400 hover:text-forge-900 dark:hover:text-white hover:bg-forge-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right Action: Theme toggle, AI Quota, Command Palette, User badge */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Dark Mode Toggle Button (Compact & accessible across all devices) */}
            <button
              onClick={toggleTheme}
              title={`Current theme: ${actualTheme}. Click to toggle.`}
              aria-label="Toggle theme mode"
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
            >
              {theme === 'system' ? (
                <Laptop className="w-4 h-4 text-accent-500" />
              ) : actualTheme === 'dark' ? (
                <Moon className="w-4 h-4 text-indigo-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </button>

            {/* Authenticated user features */}
            {user ? (
              <>
                {/* Command Palette Trigger */}
                <button
                  onClick={() => {
                    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true });
                    window.dispatchEvent(event);
                  }}
                  className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors shadow-2xs"
                  title="Command Palette (Ctrl+K or ⌘K)"
                >
                  <Command className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                  <span>Menu</span>
                  <kbd className="px-1.5 py-0.2 text-[9px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-400 shadow-2xs">
                    ⌘K
                  </kbd>
                </button>

                {/* AI Calls Remaining Pill */}
                <Link
                  to="/ai"
                  title="Daily Honest AI Quota (Resets daily at midnight)"
                  className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-forge-50 dark:bg-slate-800 border border-forge-200 dark:border-slate-700 text-forge-700 dark:text-slate-300 hover:bg-forge-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>
                    <strong className="text-forge-900 dark:text-white font-bold">
                      {Math.max(0, aiUsage.maxDailyCalls - aiUsage.callsUsedToday)}
                    </strong>
                    /{aiUsage.maxDailyCalls} AI
                  </span>
                </Link>

                {/* User status */}
                <div className="flex items-center space-x-2 pl-2 border-l border-forge-200 dark:border-slate-800">
                  <div className="hidden sm:block text-right">
                    <div className="text-xs font-semibold text-forge-900 dark:text-white leading-none">{user.fullName}</div>
                    <div className="text-[10px] text-forge-500 dark:text-slate-400">{user.email}</div>
                  </div>
                  <button
                    onClick={() => signOut()}
                    title="Sign out"
                    className="p-1.5 rounded-md text-forge-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile hamburger menu toggle */}
                <div className="flex lg:hidden items-center">
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle navigation menu"
                    className="p-2 rounded-md text-forge-600 dark:text-slate-400 hover:text-forge-900 dark:hover:text-white hover:bg-forge-100 dark:hover:bg-slate-800"
                  >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-forge-900 dark:bg-brand-600 text-white hover:bg-forge-800 dark:hover:bg-brand-500 transition-colors shadow-xs"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Only when user is authenticated) */}
      {mobileMenuOpen && user && (
        <div className="lg:hidden border-t border-forge-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium ${
                  active 
                    ? 'bg-forge-100 dark:bg-slate-800 text-forge-900 dark:text-white font-bold' 
                    : 'text-forge-600 dark:text-slate-400 hover:bg-forge-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-forge-200 dark:border-slate-800 mt-2 flex justify-between items-center px-3">
            <div>
              <div className="text-xs font-semibold text-forge-900 dark:text-white">{user.fullName}</div>
              <div className="text-[11px] text-forge-500 dark:text-slate-400">{user.email}</div>
            </div>
            <button
              onClick={() => {
                signOut();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-1 text-xs text-rose-600 dark:text-rose-400 font-medium px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
