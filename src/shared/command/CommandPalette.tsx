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

interface PaletteAction {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  icon: React.ElementType;
  run: () => void;
}

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

  const actions: PaletteAction[] = [
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
      id: 'profile',
      title: 'Master Career Profile',
      category: 'Navigation',
      icon: User,
      run: () => navigate('/profile'),
    },
    {
      id: 'applications',
      title: 'Applications Tracker',
      category: 'Navigation',
      icon: Briefcase,
      run: () => navigate('/applications'),
    },
    {
      id: 'ai_tailor',
      title: 'AI Resume Tailoring',
      category: 'AI Tools',
      icon: Sparkles,
      run: () => navigate('/ai'),
    },
    {
      id: 'ats_analyzer',
      title: 'ATS Resume Scorer',
      category: 'AI Tools',
      icon: FileCheck,
      run: () => navigate('/analyzer'),
    },
    {
      id: 'settings',
      title: 'Settings & Data Export',
      category: 'Navigation',
      icon: Settings,
      run: () => navigate('/settings'),
    },
    {
      id: 'preview',
      title: 'Live Preview & Web Portfolio',
      subtitle: 'Preview your live interactive career showcase',
      category: 'Navigation',
      icon: Eye,
      run: () => navigate('/portfolio'),
    },
  ];

  // Resume item actions
  const resumeActions = resumes.map((r) => ({
    id: `resume_${r.id}`,
    title: r.title,
    subtitle: `Target: ${r.targetRole || 'General'} • ${r.meta?.template || 'classic'}`,
    category: 'My Resumes',
    icon: FileText,
    run: () => navigate(`/editor/${r.id}`),
  }));

  const allItems = [...actions, ...resumeActions];

  const filtered = query.trim() === ''
    ? allItems.slice(0, 8)
    : allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase())) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-sm no-print">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-forge-200 dark:border-slate-800 overflow-hidden"
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-forge-100 dark:border-slate-800">
            <Search className="w-5 h-5 text-forge-400 dark:text-slate-500 mr-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command, page, or resume name..."
              autoFocus
              className="w-full bg-transparent text-sm font-medium text-forge-900 dark:text-white placeholder-forge-400 dark:placeholder-slate-500 focus:outline-none"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-forge-400 hover:text-forge-600 dark:hover:text-slate-300 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-xs text-forge-400 dark:text-slate-500 font-medium">
                No matching actions or resumes found.
              </div>
            ) : (
              filtered.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      item.run();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-forge-50 dark:hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-forge-100 dark:bg-slate-800 flex items-center justify-center text-forge-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/50 transition-colors shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold text-forge-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                          {item.title}
                        </div>
                        {item.subtitle && (
                          <div className="text-[11px] text-forge-400 dark:text-slate-500 truncate">
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-[10px] font-semibold text-forge-400 dark:text-slate-500 uppercase tracking-wider px-2 py-0.5 rounded-md bg-forge-50 dark:bg-slate-800 border border-forge-100 dark:border-slate-700/60">
                        {item.category}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-forge-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts hint */}
          <div className="px-4 py-2 bg-forge-50 dark:bg-slate-950/40 border-t border-forge-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-forge-400 dark:text-slate-500 font-mono">
            <span>Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-forge-200 dark:border-slate-700 rounded shadow-xs text-forge-600 dark:text-slate-300">ESC</kbd> to close</span>
            <span>ResumeForge Palette</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
