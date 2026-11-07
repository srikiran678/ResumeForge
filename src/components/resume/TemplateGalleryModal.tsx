import React, { useState } from 'react';
import { X, Check, Sparkles, Filter, Eye, LayoutGrid, List, CheckCircle2, ArrowRight } from 'lucide-react';
import { getAllTemplates } from '../../templates';
import { TemplateId } from '../../types';
import { useWorkspace } from '../../context/WorkspaceContext';
import { TemplateThumbnail } from './TemplateThumbnail';
import { TemplateFullPreviewModal } from './TemplateFullPreviewModal';

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
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [inspectingTemplateId, setInspectingTemplateId] = useState<TemplateId | null>(null);

  // Retrieve active resume if available from workspace
  const workspace = useWorkspace();
  const activeResume = workspace?.currentResume || workspace?.resumes?.[0] || null;

  const allTemplates = getAllTemplates();

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: `All Templates (${allTemplates.length})` },
    { id: 'placement', label: 'Campus Placement & Freshers' },
    { id: 'tech', label: 'Engineering & Tech' },
    { id: 'academic', label: 'Research & Academics' },
    { id: 'finance', label: 'Finance & Classic' },
    { id: 'leadership', label: 'Leadership & Exec' },
  ];

  const filteredTemplates = allTemplates.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'placement') return ['classic-resume', 'classic', 'compact', 'academic'].includes(t.id);
    if (filter === 'tech') return ['modern', 'compact', 'minimal', 'technical', 'hackathon', 'classic-resume'].includes(t.id);
    if (filter === 'academic') return ['academic', 'classic-resume', 'classic', 'compact'].includes(t.id);
    if (filter === 'finance') return ['classic', 'elegant', 'executive', 'classic-resume'].includes(t.id);
    if (filter === 'leadership') return ['executive', 'modern', 'classic'].includes(t.id);
    return true;
  });

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/70 backdrop-blur-md animate-fade-in">
        <div className="bg-white dark:bg-[#121316] rounded-2xl sm:rounded-3xl shadow-2xl max-w-5xl w-full p-4 sm:p-6 md:p-7 text-left border border-slate-200 dark:border-white/[0.08] max-h-[95dvh] sm:max-h-[92vh] flex flex-col transition-colors">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 dark:border-white/[0.08]">
            <div className="flex items-center space-x-2.5 sm:space-x-3">
              <div className="size-9 sm:size-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white font-display">
                    Resume Templates Preview
                  </h2>
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    100% Single-Column ATS
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Visually inspect layouts, typography, and section structures before creating or switching.
                </p>
              </div>
            </div>

            {/* View Mode Toggle & Close */}
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="flex items-center bg-slate-100 dark:bg-white/[0.05] p-0.5 rounded-xl border border-slate-200/70 dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  title="Grid View (Visual Thumbnails)"
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('compact')}
                  title="Compact View (Mobile Optimized)"
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    viewMode === 'compact'
                      ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Horizontally Scrollable Filter Tabs (Mobile Compact) */}
          <div className="relative py-2.5 sm:py-3 border-b border-slate-100 dark:border-white/[0.06] shrink-0">
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    filter === cat.id
                      ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                      : 'bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/[0.08]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Templates Container (Switch between Visual Grid and Mobile Compact List) */}
          <div className="flex-1 overflow-y-auto py-3 sm:py-4 pr-1">
            {viewMode === 'grid' ? (
              /* Visual Grid View with High-Fidelity Document Thumbnails */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                {filteredTemplates.map((template) => {
                  const isSelected = template.id === selectedTemplateId;

                  return (
                    <div
                      key={template.id}
                      onClick={() => onSelectTemplate(template.id)}
                      className={`group relative rounded-2xl p-3.5 sm:p-4 transition-all flex flex-col justify-between border cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20 shadow-md'
                          : 'border-slate-200 dark:border-white/[0.08] bg-slate-50/40 dark:bg-[#16171d]/60 hover:border-slate-300 dark:hover:border-white/[0.16] hover:bg-white dark:hover:bg-[#1a1b22] hover:shadow-xs'
                      }`}
                    >
                      <div>
                        {/* Header Info */}
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-display block">
                              {template.name}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                              {template.bestFor.split(',')[0]}
                            </span>
                          </div>
                          {template.badge && (
                            <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.08] text-slate-700 dark:text-slate-300">
                              {template.badge}
                            </span>
                          )}
                        </div>

                        {/* Visual Document Layout Thumbnail */}
                        <div className="my-2.5">
                          <TemplateThumbnail
                            templateId={template.id}
                            size="md"
                            onPreviewClick={() => setInspectingTemplateId(template.id)}
                          />
                        </div>

                        <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                          {template.description}
                        </p>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-2 border-t border-slate-200/70 dark:border-white/[0.06] flex justify-between items-center text-xs">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectingTemplateId(template.id);
                          }}
                          className="text-[11px] font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center space-x-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview Full</span>
                        </button>

                        {isSelected ? (
                          <span className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Selected</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                          >
                            Use Template →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Compact Mobile-Optimized List View */
              <div className="space-y-2">
                {filteredTemplates.map((template) => {
                  const isSelected = template.id === selectedTemplateId;

                  return (
                    <div
                      key={template.id}
                      onClick={() => onSelectTemplate(template.id)}
                      className={`group p-2.5 sm:p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/30 dark:bg-indigo-950/30 ring-1 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-white/[0.08] bg-slate-50/40 dark:bg-[#16171d]/60 hover:bg-white dark:hover:bg-[#1a1b22]'
                      }`}
                    >
                      {/* Left: Mini Preview Thumbnail */}
                      <div className="shrink-0">
                        <TemplateThumbnail
                          templateId={template.id}
                          size="sm"
                          showOverlayButton={false}
                        />
                      </div>

                      {/* Middle: Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                            {template.name}
                          </span>
                          {template.badge && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400 shrink-0">
                              {template.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {template.description}
                        </p>
                        <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium truncate mt-0.5">
                          Best for: {template.bestFor}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectingTemplateId(template.id);
                          }}
                          title="Full Screen Preview"
                          aria-label={`Preview ${template.name}`}
                          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {isSelected ? (
                          <span className="p-2 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center space-x-1">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                          >
                            Use
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-100 dark:border-white/[0.08] flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500 shrink-0">
            <span className="text-[11px] text-center sm:text-left">
              All {allTemplates.length} templates are strictly single-column, ATS parser verified, and vector PDF ready.
            </span>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setInspectingTemplateId(selectedTemplateId)}
                className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Current</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-1.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold rounded-xl shadow-xs cursor-pointer text-center"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Full Screen Live Inspection Modal */}
      {inspectingTemplateId && (
        <TemplateFullPreviewModal
          isOpen={Boolean(inspectingTemplateId)}
          initialTemplateId={inspectingTemplateId}
          activeResume={activeResume}
          onSelectTemplate={(tId) => {
            onSelectTemplate(tId);
            setInspectingTemplateId(null);
          }}
          onClose={() => setInspectingTemplateId(null)}
        />
      )}
    </>
  );
};
