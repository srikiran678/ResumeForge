import React, { useState } from 'react';
import { X, Check, Sparkles, Filter, Eye, Award, CheckCircle2 } from 'lucide-react';
import { TEMPLATE_REGISTRY, getAllTemplates, TemplateDefinition } from '../../templates';
import { TemplateId } from '../../types';

interface TemplateGalleryModalProps {
  isOpen: boolean;
  selectedTemplateId: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
  onClose: () => void;
}

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({
  isOpen,
  selectedTemplateId,
  onSelectTemplate,
  onClose,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const allTemplates = getAllTemplates();

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Templates (10)' },
    { id: 'tech', label: 'Engineering & Tech' },
    { id: 'leadership', label: 'Leadership & Exec' },
    { id: 'finance', label: 'Finance & Classic' },
    { id: 'academic', label: 'Research & Academics' },
  ];

  const filteredTemplates = allTemplates.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'tech') return ['modern', 'compact', 'minimal', 'technical', 'hackathon'].includes(t.id);
    if (filter === 'leadership') return ['executive', 'modern', 'classic'].includes(t.id);
    if (filter === 'finance') return ['classic', 'elegant', 'executive'].includes(t.id);
    if (filter === 'academic') return ['academic', 'classic', 'compact'].includes(t.id);
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#121316] rounded-3xl shadow-2xl max-w-5xl w-full p-5 sm:p-7 text-left border border-slate-200 dark:border-white/[0.08] max-h-[92vh] flex flex-col transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <div className="size-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-950 dark:text-white font-display">
                  Professional ATS Resume Templates
                </h2>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  100% Single-Column ATS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Engineered for maximum recruiter readability, top-to-bottom parser compatibility, and pure vector PDF export.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 py-3 border-b border-slate-100 dark:border-white/[0.06]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === cat.id
                  ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                  : 'bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/[0.08]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-1">
          {filteredTemplates.map((template) => {
            const isSelected = template.id === selectedTemplateId;

            return (
              <div
                key={template.id}
                onClick={() => onSelectTemplate(template.id)}
                className={`group relative rounded-2xl p-4 transition-all flex flex-col justify-between border cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-[#18191f]/60 hover:border-slate-300 dark:hover:border-white/[0.16] hover:bg-white dark:hover:bg-[#1a1b22]'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-display">
                      {template.name}
                    </span>
                    {template.badge && (
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-white/[0.08] text-slate-700 dark:text-slate-300">
                        {template.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                    {template.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#111215] border border-slate-200/80 dark:border-white/[0.06] text-[11px] space-y-1 mb-3">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                      Recommended For:
                    </div>
                    <div className="text-slate-700 dark:text-slate-300 font-medium">
                      {template.bestFor}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/70 dark:border-white/[0.06] flex justify-between items-center">
                  <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400">
                    ATS Score: 100% Pass
                  </span>
                  {isSelected ? (
                    <span className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="text-xs font-semibold text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                    >
                      Use Template →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-white/[0.08] flex justify-between items-center text-xs text-slate-500">
          <span>All 10 templates use deterministic ATS-compliant single-column structures.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold rounded-xl shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
