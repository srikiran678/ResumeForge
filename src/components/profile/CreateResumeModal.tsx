import React, { useState } from 'react';
import { X, FileText, Check, Sparkles, Layout } from 'lucide-react';
import { TemplateId } from '../../types';
import { getAllTemplates } from '../../templates';

interface CreateResumeModalProps {
  isOpen: boolean;
  masterProfile?: any; // kept optional for backwards-compatibility
  onCreate: (title: string, targetRole: string, targetCompany: string, template: TemplateId) => void;
  onClose: () => void;
}

export const CreateResumeModal: React.FC<CreateResumeModalProps> = ({
  isOpen,
  onCreate,
  onClose,
}) => {
  const [title, setTitle] = useState('Software Engineer Resume');
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [targetCompany, setTargetCompany] = useState('');
  const [template, setTemplate] = useState<TemplateId>('modern');

  if (!isOpen) return null;

  const allTemplates = getAllTemplates();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(title.trim() || 'New Resume', targetRole.trim(), targetCompany.trim(), template);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-xl w-full p-6 text-left border border-forge-200 dark:border-slate-800 max-h-[90vh] flex flex-col transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-forge-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="size-9 rounded-xl bg-forge-900 dark:bg-slate-800 border border-transparent dark:border-slate-700 flex items-center justify-center text-white">
              <FileText className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-forge-900 dark:text-white text-balance">Create New ATS Resume</h2>
              <p className="text-[11px] text-forge-500 dark:text-slate-400 text-pretty">
                100% single-column layout guaranteed to parse cleanly into any ATS.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-forge-400 dark:text-slate-400 hover:text-forge-700 dark:hover:text-white hover:bg-forge-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Resume Title */}
          <div>
            <label className="block text-xs font-semibold text-forge-800 dark:text-slate-300 mb-1">
              Resume Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Full Stack Engineer (FinTech)"
              className="w-full text-xs p-2.5 border border-forge-300 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-forge-900 dark:focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Target Role & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-forge-800 dark:text-slate-300 mb-1">
                Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Software Engineer"
                className="w-full text-xs p-2.5 border border-forge-300 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-forge-900 dark:focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-forge-800 dark:text-slate-300 mb-1">
                Target Company <span className="text-[10px] text-forge-400">(Optional)</span>
              </label>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g. Google, Stripe"
                className="w-full text-xs p-2.5 border border-forge-300 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-forge-900 dark:focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-forge-800 dark:text-slate-300">
                Choose ATS Template Style ({allTemplates.length} Available)
              </label>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                100% Single-Column ATS
              </span>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {allTemplates.map((t) => {
                const isSelected = template === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTemplate(t.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-start space-x-3 cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-500/30'
                        : 'border-forge-200 dark:border-slate-800 bg-forge-50/40 dark:bg-slate-800/40 hover:bg-forge-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mt-0.5 ${
                      isSelected 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-white dark:bg-slate-800 text-forge-600 dark:text-slate-400 border border-forge-200 dark:border-slate-700'
                    }`}>
                      <Layout className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-forge-900 dark:text-white">
                            {t.name}
                          </span>
                          {t.badge && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-white/[0.08] text-slate-700 dark:text-slate-300">
                              {t.badge}
                            </span>
                          )}
                        </div>
                        {isSelected && (
                          <span className="flex items-center space-x-1 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" />
                            <span>Selected</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-forge-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {t.description}
                      </p>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium block mt-0.5">
                        Best for: {t.bestFor}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-forge-100 dark:border-slate-800 flex justify-end items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-forge-600 dark:text-slate-400 hover:bg-forge-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-forge-900 dark:bg-indigo-600 hover:bg-forge-800 dark:hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-xs flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create & Open Editor</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
