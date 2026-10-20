import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  FileText, 
  User, 
  Briefcase, 
  Sparkles, 
  Download, 
  FileCheck, 
  Zap, 
  Settings, 
  Plus, 
  Eye, 
  X,
  Command,
  ArrowRight,
  Layers,
  History
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { resumes, currentResume } = useWorkspace();

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const actions = [
    {
      id: 'create_resume',
      title: 'Create New Resume',
      category: 'Resumes',
      icon: Plus,
      run: () => {
        navigate('/resumes');
      },
    },
    {
      id: 'dashboard',
      title: 'Go to Dashboard',
      category: 'Navigation',
      icon: Layers,
      run: () => navigate('/dashboard'),
    },
    {
      id: 'applications',
      title: 'View Job Applications Tracker',
      category: 'Navigation',
      icon: Briefcase,
      run: () => navigate('/applications'),
    },
    {
      id: 'ai_tools',
      title: 'Launch AI Career Tools',
      category: 'AI',
      icon: Sparkles,
      run: () => navigate('/ai'),
    },
    {
      id: 'ats_analyzer',
      title: 'Run ATS Compatibility Analyzer',
      category: 'ATS',
      icon: FileCheck,
      run: () => {
        if (currentResume) navigate(`/analyzer/${currentResume.id}`);
        else navigate('/resumes');
      },
    },
    {
      id: 'settings',
      title: 'Account & Privacy Settings',
      category: 'Settings',
      icon: Settings,
      run: () => navigate('/settings'),
    },
  ];

  // Dynamic filter
  const filteredActions = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredResumes = resumes.filter((r) =>
    r.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {/* Keyboard Shortcut Indicator Button in Navbar / Fixed bottom left */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors shadow-xs"
        title="Quick Command Palette (Ctrl+K or ⌘K)"
      >
        <Command className="w-3.5 h-3.5 text-slate-600" />
        <span>Command Menu</span>
        <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-600 shadow-2xs">
          ⌘K
        </kbd>
      </button>

      {/* Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-xs no-print">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden text-left"
            >
              {/* Search Bar */}
              <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
                <Search className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command, search resumes, or jump to a section..."
                  className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700"
                >
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-200 rounded">ESC</kbd>
                </button>
              </div>

              {/* Action List */}
              <div className="max-h-96 overflow-y-auto p-2 space-y-1 text-xs">
                {/* Resumes Match */}
                {filteredResumes.length > 0 && (
                  <div className="mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 block">
                      Active Resumes
                    </span>
                    {filteredResumes.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          setIsOpen(false);
                          navigate(`/editor/${r.id}`);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-800 transition-colors text-left"
                      >
                        <div className="flex items-center space-x-2.5">
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold">{r.title}</span>
                          <span className="text-[10px] text-slate-400 capitalize">({r.meta.template})</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">v{r.meta.version}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick Actions */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 block">
                    Workspace Actions
                  </span>
                  {filteredActions.map((act) => {
                    const Icon = act.icon;
                    return (
                      <button
                        key={act.id}
                        onClick={() => {
                          setIsOpen(false);
                          act.run();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-800 transition-colors text-left group"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-white flex items-center justify-center text-slate-600 group-hover:text-slate-900 border border-slate-200">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-semibold block">{act.title}</span>
                            <span className="text-[10px] text-slate-400">{act.category}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center space-x-3">
                  <span>Navigate with keyboard</span>
                  <span>•</span>
                  <span>Enter to select</span>
                </div>
                <span className="font-mono text-[10px]">ResumeForge CLI</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
