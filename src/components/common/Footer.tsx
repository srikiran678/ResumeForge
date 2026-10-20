import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, FileCheck, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-forge-200 dark:border-slate-800 mt-auto py-10 no-print transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-md bg-forge-900 dark:bg-slate-800 border border-transparent dark:border-slate-700 flex items-center justify-center text-white font-bold text-sm">
                RF
              </div>
              <span className="font-bold text-lg text-forge-900 dark:text-white">ResumeForge</span>
            </div>
            <p className="text-xs text-forge-600 dark:text-slate-400 font-medium italic">
              "Write once. Adapt honestly. Apply everywhere."
            </p>
            <p className="text-xs text-forge-500 dark:text-slate-400 max-w-md leading-relaxed">
              ResumeForge is a completely free, ATS-first resume builder and career workspace designed specifically for students, freshers, internship candidates, and entry-level developers.
            </p>
            <div className="flex items-center space-x-3 text-xs text-forge-600 dark:text-slate-400 font-semibold pt-1">
              <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Paywalls</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Real Selectable Text</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Honest AI</span>
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-forge-900 dark:text-white mb-3">Workspace</h3>
            <ul className="space-y-2 text-xs text-forge-600 dark:text-slate-400">
              <li><Link to="/dashboard" className="hover:text-forge-900 dark:hover:text-white">Dashboard</Link></li>
              <li><Link to="/resumes" className="hover:text-forge-900 dark:hover:text-white">Resume Manager</Link></li>
              <li><Link to="/applications" className="hover:text-forge-900 dark:hover:text-white">Application Tracker</Link></li>
              <li><Link to="/ai" className="hover:text-forge-900 dark:hover:text-white">AI Tailoring</Link></li>
            </ul>
          </div>

          {/* Core Principles & Privacy */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-forge-900 dark:text-white mb-3">Commitment</h3>
            <ul className="space-y-2 text-xs text-forge-600 dark:text-slate-400">
              <li><Link to="/settings" className="hover:text-forge-900 dark:hover:text-white">Privacy & Data Ownership</Link></li>
              <li><Link to="/settings" className="hover:text-forge-900 dark:hover:text-white">Appearance & Dark Mode</Link></li>
              <li><Link to="/settings" className="hover:text-forge-900 dark:hover:text-white">Export All Data (JSON)</Link></li>
              <li><Link to="/settings" className="hover:text-forge-900 dark:hover:text-white">Danger Zone & Data Purge</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-forge-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-forge-500 dark:text-slate-500 gap-2">
          <div>
            &copy; {new Date().getFullYear()} ResumeForge. Built for student career empowerment.
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-[11px] font-mono">MIT Open Architecture</span>
            <span>•</span>
            <span className="text-[11px] font-mono">100% Free Forever</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
