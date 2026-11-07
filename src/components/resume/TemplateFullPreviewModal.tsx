import React, { useState, useMemo } from 'react';
import { X, Check, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, Sparkles, User, FileText, CheckCircle2 } from 'lucide-react';
import { TemplateId, ResumeData } from '@/data/types';
import { TemplateRegistry, getAllTemplates } from '@/modules/templates';
import { SAMPLE_PREVIEW_RESUME } from './templatePreviewData';

interface TemplateFullPreviewModalProps {
  isOpen: boolean;
  initialTemplateId: TemplateId;
  activeResume?: ResumeData | null;
  onSelectTemplate: (templateId: TemplateId) => void;
  onClose: () => void;
}

export const TemplateFullPreviewModal: React.FC<TemplateFullPreviewModalProps> = ({
  isOpen,
  initialTemplateId,
  activeResume,
  onSelectTemplate,
  onClose,
}) => {
  const [currentTemplateId, setCurrentTemplateId] = useState<TemplateId>(initialTemplateId);
  const [usePersonalData, setUsePersonalData] = useState<boolean>(Boolean(activeResume?.basics?.name));
  const [zoomScale, setZoomScale] = useState<number>(0.85);

  const allTemplates = useMemo(() => getAllTemplates(), []);
  const currentIndex = allTemplates.findIndex((t) => t.id === currentTemplateId);
  const templateDef = TemplateRegistry.getDefinition(currentTemplateId);

  // Sync initial template on open
  React.useEffect(() => {
    setCurrentTemplateId(initialTemplateId);
  }, [initialTemplateId]);

  if (!isOpen || !templateDef) return null;

  // Selected document data
  const documentData: ResumeData = {
    ...(usePersonalData && activeResume ? activeResume : SAMPLE_PREVIEW_RESUME),
    meta: {
      ...(usePersonalData && activeResume ? activeResume.meta : SAMPLE_PREVIEW_RESUME.meta),
      template: currentTemplateId,
    },
  };

  const TemplateComponent = templateDef.component;

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + allTemplates.length) % allTemplates.length;
    setCurrentTemplateId(allTemplates[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % allTemplates.length;
    setCurrentTemplateId(allTemplates[nextIdx].id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-100 dark:bg-[#0c0d11] w-full h-full sm:h-[94vh] sm:max-w-6xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-300 dark:border-white/[0.08] transition-colors">
        {/* Top Control Bar */}
        <header className="bg-white/95 dark:bg-[#121316]/95 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between gap-3 shrink-0">
          {/* Left: Template Switcher & Info */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={handlePrev}
              title="Previous Template"
              aria-label="Previous Template"
              className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white font-display">
                  {templateDef.name}
                </h2>
                {templateDef.badge && (
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {templateDef.badge}
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                {templateDef.bestFor}
              </p>
            </div>

            <button
              onClick={handleNext}
              title="Next Template"
              aria-label="Next Template"
              className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Right: Data toggle, Zoom & Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            {/* Toggle Data Source (Sample vs My Resume) */}
            {activeResume?.basics?.name && (
              <button
                type="button"
                onClick={() => setUsePersonalData(!usePersonalData)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold flex items-center space-x-1.5 border transition-all cursor-pointer ${
                  usePersonalData
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{usePersonalData ? 'Using My Resume Data' : 'Sample Data'}</span>
                <span className="md:hidden">{usePersonalData ? 'My Data' : 'Sample'}</span>
              </button>
            )}

            {/* Zoom Controls (Desktop / Tablet) */}
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-white/[0.06] rounded-xl p-0.5 border border-slate-200 dark:border-white/[0.08]">
              <button
                onClick={() => setZoomScale((s) => Math.max(0.45, Math.round((s - 0.1) * 100) / 100))}
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white cursor-pointer"
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono font-bold px-1.5 min-w-[40px] text-center text-slate-700 dark:text-slate-300">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => setZoomScale((s) => Math.min(1.4, Math.round((s + 0.1) * 100) / 100))}
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white cursor-pointer"
                title="Zoom In"
                aria-label="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomScale(0.85)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-l border-slate-200 dark:border-white/[0.08] cursor-pointer"
                title="Reset Zoom"
                aria-label="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Primary Use CTA */}
            <button
              onClick={() => {
                onSelectTemplate(currentTemplateId);
                onClose();
              }}
              className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 text-xs sm:text-sm font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
              <span>Use This Template</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close Preview"
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Live Canvas Viewport */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start relative select-text">
          <div
            className="transition-transform duration-200 ease-out origin-top shadow-2xl rounded-xs bg-white text-black"
            style={{
              transform: `scale(${zoomScale})`,
              width: '850px',
              minHeight: '1100px',
            }}
          >
            <TemplateComponent resume={documentData} />
          </div>
        </div>

        {/* Bottom Mobile Carousel / Quick Selector */}
        <footer className="bg-white/95 dark:bg-[#121316]/95 backdrop-blur-md px-4 py-2.5 border-t border-slate-200 dark:border-white/[0.08] shrink-0">
          <div className="flex items-center justify-between gap-3 max-w-5xl mx-auto">
            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
              Template {currentIndex + 1} of {allTemplates.length}
            </span>

            {/* Quick Horizontal Carousel Dots/Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
              {allTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setCurrentTemplateId(t.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                    t.id === currentTemplateId
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                      : 'bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {t.name.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Mobile-only Zoom controls */}
            <div className="flex sm:hidden items-center space-x-1">
              <button
                onClick={() => setZoomScale((s) => Math.max(0.4, s - 0.15))}
                className="p-1 rounded bg-slate-100 dark:bg-white/[0.08] text-slate-600 dark:text-slate-300 text-xs"
              >
                -
              </button>
              <span className="text-[10px] font-mono text-slate-500">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => setZoomScale((s) => Math.min(1.2, s + 0.15))}
                className="p-1 rounded bg-slate-100 dark:bg-white/[0.08] text-slate-600 dark:text-slate-300 text-xs"
              >
                +
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
