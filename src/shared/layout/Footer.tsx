import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, FileCheck } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-forge-200 dark:border-slate-800 mt-auto py-10 no-print transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-2">
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
              <li><Link to="/profile" className="hover:text-forge-900 dark:hover:text-white">Master Profile</Link></li>
              <li><Link to="/templates" className="hover:text-forge-900 dark:hover:text-white">Company Templates</Link></li>
              <li><Link to="/applications" className="hover:text-forge-900 dark:hover:text-white">Application Tracker</Link></li>
            </ul>
          </div>

          {/* Career Suite */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-forge-900 dark:text-white mb-3">Career Suite</h3>
            <ul className="space-y-2 text-xs text-forge-600 dark:text-slate-400">
              <li><Link to="/jobs" className="hover:text-forge-900 dark:hover:text-white">Job Search Explorer</Link></li>
              <li><Link to="/analytics" className="hover:text-forge-900 dark:hover:text-white">Pipeline Analytics</Link></li>
              <li><Link to="/cover-letters" className="hover:text-forge-900 dark:hover:text-white">Cover Letter Studio</Link></li>
              <li><Link to="/interview-prep" className="hover:text-forge-900 dark:hover:text-white">Interview Prep</Link></li>
              <li><Link to="/job-match" className="hover:text-forge-900 dark:hover:text-white">Job Match Radar</Link></li>
              <li><Link to="/salary-intel" className="hover:text-forge-900 dark:hover:text-white">Salary Intelligence</Link></li>
              <li><Link to="/upskilling" className="hover:text-forge-900 dark:hover:text-white">Skill Gap Roadmaps</Link></li>
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
            &copy; {CURRENT_YEAR} ResumeForge. Built for student career empowerment.
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
