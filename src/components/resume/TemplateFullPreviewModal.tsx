import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Check, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  FileText, 
  Maximize2,
  Minimize2,
  Layers
} from 'lucide-react';
import { TemplateId, ResumeData } from '@/data/types';
import { TemplateRegistry, getAllTemplates } from '@/modules/templates';
import { SAMPLE_PREVIEW_RESUME } from './templatePreviewData';

interface TemplateFullPreviewModalProps {
  isOpen: boolean;
  initialTemplateId: TemplateId;
  activeResume?: ResumeData | null;
  onSelectTemplate?: (templateId: TemplateId) => void;
  onClose: () => void;
  title?: string;
}

export const TemplateFullPreviewModal: React.FC<TemplateFullPreviewModalProps> = ({
  isOpen,
  initialTemplateId,
  activeResume,
  onSelectTemplate,
  onClose,
  title,
}) => {
  const [currentTemplateId, setCurrentTemplateId] = useState<TemplateId>(initialTemplateId);
  const [usePersonalData, setUsePersonalData] = useState<boolean>(Boolean(activeResume?.basics?.name));
  
  // Responsive auto-fit calculation: calculate scale to fit the whole 1100px document inside the viewport
  const calculateFitPageScale = () => {
    if (typeof window === 'undefined') return 0.58;
    const availableHeight = window.innerHeight * 0.76;
    return Math.min(0.72, Math.max(0.42, Math.round((availableHeight / 1150) * 100) / 100));
  };

  const [zoomScale, setZoomScale] = useState<number>(() => calculateFitPageScale());

  const allTemplates = useMemo(() => getAllTemplates(), []);
  const currentIndex = allTemplates.findIndex((t) => t.id === currentTemplateId);
  const templateDef = TemplateRegistry.getDefinition(currentTemplateId);

  // Sync initial template on open & recalculate whole page fit
  useEffect(() => {
    if (isOpen) {
      setCurrentTemplateId(initialTemplateId);
      setZoomScale(calculateFitPageScale());
    }
  }, [isOpen, initialTemplateId]);

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
      <div className="bg-slate-100 dark:bg-[#0c0d11] w-full h-full sm:h-[95vh] sm:max-w-6xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-300 dark:border-white/[0.08] transition-colors">
        {/* Top Header Control Bar */}
        <header className="bg-white/95 dark:bg-[#121316]/95 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between gap-3 shrink-0">
          {/* Left: Template Switcher & Title */}
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
                  {title || templateDef.name}
                </h2>
                {templateDef.badge && (
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {templateDef.badge}
                  </span>
                )}
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Whole Resume ATS Format</span>
                </span>
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

          {/* Right: Data toggle, Whole Page Presets & Actions */}
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
                title="Toggle between complete sample structure and your active resume draft"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{usePersonalData ? 'Using My Resume Data' : 'Sample Structure'}</span>
                <span className="md:hidden">{usePersonalData ? 'My Data' : 'Sample'}</span>
              </button>
            )}

            {/* Whole Page Fit & Zoom Controls */}
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-white/[0.06] rounded-xl p-0.5 border border-slate-200 dark:border-white/[0.08]">
              <button
                type="button"
                onClick={() => setZoomScale(calculateFitPageScale())}
                className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-colors flex items-center space-x-1 cursor-pointer ${
                  Math.abs(zoomScale - calculateFitPageScale()) < 0.05
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950'
                }`}
                title="Fit the entire resume on one screen without scrolling"
              >
                <Minimize2 className="w-3 h-3" />
                <span>Fit Whole Page</span>
              </button>

              <button
                type="button"
                onClick={() => setZoomScale(0.85)}
                className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-colors cursor-pointer ${
                  Math.abs(zoomScale - 0.85) < 0.02
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950'
                }`}
                title="Fit to comfortable reading width"
              >
                Fit Width
              </button>

              <button
                type="button"
                onClick={() => setZoomScale(1)}
                className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-colors cursor-pointer ${
                  Math.abs(zoomScale - 1) < 0.02
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950'
                }`}
                title="View actual 100% vector scale"
              >
                100%
              </button>

              <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

              <button
                onClick={() => setZoomScale((s) => Math.max(0.35, Math.round((s - 0.08) * 100) / 100))}
                className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white cursor-pointer"
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono font-bold px-1.5 min-w-[36px] text-center text-slate-700 dark:text-slate-300">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => setZoomScale((s) => Math.min(1.4, Math.round((s + 0.08) * 100) / 100))}
                className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white cursor-pointer"
                title="Zoom In"
                aria-label="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Primary Action Button */}
            {onSelectTemplate ? (
              <button
                onClick={() => {
                  onSelectTemplate(currentTemplateId);
                  onClose();
                }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 text-xs sm:text-sm font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                <span>Use Template</span>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
              >
                Done
              </button>
            )}

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

        {/* Structure Roadmap Sub-banner */}
        <div className="bg-slate-50 dark:bg-[#111216] px-4 py-1.5 border-b border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between text-[10px] text-slate-500 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center space-x-2 shrink-0">
            <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Layers className="w-3 h-3 text-indigo-500" />
              <span>Full Document Structure:</span>
            </span>
            <span>Header</span>
            <span>→</span>
            <span>Summary / Objective</span>
            <span>→</span>
            <span>Education</span>
            <span>→</span>
            <span>Experience</span>
            <span>→</span>
            <span>Projects</span>
            <span>→</span>
            <span>Technical Skills</span>
            <span>→</span>
            <span>Certifications</span>
            <span>→</span>
            <span>Declaration</span>
          </div>

          <span className="font-mono hidden lg:inline text-slate-400">
            Letter (8.5 × 11 in) • Vector Render
          </span>
        </div>

        {/* Live Canvas Viewport (Desk Background with Pure White Document) */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 flex justify-center items-start relative select-text bg-slate-200/80 dark:bg-[#07080a]">
          <div
            className="resume-document-container transition-transform duration-200 ease-out origin-top shadow-2xl rounded-xs bg-white text-black"
            style={{
              transform: `scale(${zoomScale})`,
              transformOrigin: 'top center',
              width: '850px',
              minHeight: '1100px',
              backgroundColor: '#ffffff',
              color: '#000000',
              colorScheme: 'light',
            }}
          >
            <TemplateComponent resume={documentData} />
          </div>
        </div>

        {/* Bottom Mobile Carousel / Quick Selector */}
        <footer className="bg-white/95 dark:bg-[#121316]/95 backdrop-blur-md px-4 py-2 border-t border-slate-200 dark:border-white/[0.08] shrink-0">
          <div className="flex items-center justify-between gap-3 max-w-5xl mx-auto">
            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
              Template {currentIndex + 1} of {allTemplates.length}
            </span>

            {/* Quick Horizontal Carousel Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
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
                type="button"
                onClick={() => setZoomScale(calculateFitPageScale())}
                className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.08] text-slate-800 dark:text-slate-200 text-[10px] font-bold"
              >
                Fit
              </button>
              <button
                onClick={() => setZoomScale((s) => Math.max(0.35, s - 0.1))}
                className="p-1 rounded bg-slate-100 dark:bg-white/[0.08] text-slate-600 dark:text-slate-300 text-xs"
              >
                -
              </button>
              <span className="text-[10px] font-mono text-slate-500">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => setZoomScale((s) => Math.min(1.4, s + 0.1))}
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
