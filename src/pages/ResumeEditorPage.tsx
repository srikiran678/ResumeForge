import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Download, 
  History, 
  Eye, 
  Check, 
  Printer, 
  FileCheck, 
  ArrowLeft,
  ChevronDown 
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { ResumeDocument, downloadResumePDF, getAllTemplates } from '@/modules/templates';
import { SectionManager, ResumeFormManager, BulletImproverModal, VersionHistoryModal, XYZFormulaModal } from '@/modules/editor';
import { ATSAnalyzer, ATSInspectorOverlay, RecruiterScanSimulator } from '@/modules/ats';
import { AIService } from '../workspace';
import { StorageService } from '@/modules/database';
import { ResumeData, TemplateId, AISuggestion } from '@/data/types';
import confetti from 'canvas-confetti';
import { AIPrivacyModal } from '../components/common/AIPrivacyModal';
import { PersonaTestingModal } from '../components/testing/PersonaTestingModal';
import { TemplateGalleryModal } from '../components/resume/TemplateGalleryModal';
import { JobCustomizationPanel } from '../components/resume/JobCustomizationPanel';
import { Users, Zap, ZoomIn, ZoomOut, Scan, Layout, FileText } from 'lucide-react';

export const ResumeEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    loadResume, 
    currentResume, 
    updateCurrentResume, 
    saveStatus,
    versions,
    createVersionSnapshot,
    restoreVersion
  } = useWorkspace();

  // Active section accordion in editor
  const [activeAccordion, setActiveAccordion] = useState<string>('basics');
  const [previewScale, setPreviewScale] = useState(1);
  const [mobileViewTab, setMobileViewTab] = useState<'editor' | 'preview'>('editor');

  // Modals state
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [templateGalleryOpen, setTemplateGalleryOpen] = useState(false);
  const [aiPrivacyModalOpen, setAiPrivacyModalOpen] = useState(false);
  const [bulletModalOpen, setBulletModalOpen] = useState(false);
  const [activeBullet, setActiveBullet] = useState<{
    original: string;
    section: string;
    title: string;
    onApply: (newText: string) => void;
  } | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // New Testing Persona & Recruiter tools
  const [personaModalOpen, setPersonaModalOpen] = useState(false);
  const [xyzModalOpen, setXyzModalOpen] = useState(false);
  const [scanSimOpen, setScanSimOpen] = useState(false);
  const [activeXyzTarget, setActiveXyzTarget] = useState<{
    initialBullet: string;
    onApply: (b: string) => void;
  } | null>(null);
  const [moreToolsOpen, setMoreToolsOpen] = useState(false);
  const [atsInspectorActive, setAtsInspectorActive] = useState(false);

  const getBulletTelemetry = (text: string) => {
    if (!text || text.trim().length < 10) return { status: 'weak', label: 'Draft bullet' };
    const hasNumber = /\b\d+(\.\d+)?%?|\b\d+\+?|\b\d+x\b/i.test(text);
    const powerVerbs = ['engineered', 'architected', 'developed', 'optimized', 'reduced', 'automated', 'orchestrated', 'streamlined', 'designed', 'built', 'spearheaded', 'implemented', 'scaled', 'refactored', 'accelerated'];
    const hasVerb = powerVerbs.some((v) => text.toLowerCase().includes(v));

    if (hasVerb && hasNumber) return { status: 'strong', label: '⚡ Strong Impact' };
    if (hasVerb && !hasNumber) return { status: 'metric', label: '💡 Add Numbers' };
    return { status: 'verb', label: '💡 Add Action Verb' };
  };

  const handleAutoFitOnePage = () => {
    updateCurrentResume((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        spacing: 'compact',
        fontSize: 'sm',
        template: 'compact',
      },
    }));
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleApplyPersonaFix = (fixType: string) => {
    if (fixType === 'fit_1_page') {
      handleAutoFitOnePage();
    } else if (fixType === 'xyz_formula') {
      setActiveXyzTarget({
        initialBullet: currentResume?.projects[0]?.highlights[0] || '',
        onApply: (newBullet) => {
          updateCurrentResume((prev) => {
            const updated = [...prev.projects];
            if (updated[0] && updated[0].highlights) {
              updated[0].highlights[0] = newBullet;
            }
            return { ...prev, projects: updated };
          });
        },
      });
      setXyzModalOpen(true);
    } else if (fixType === 'project_links') {
      setActiveAccordion('projects');
    }
  };

  useEffect(() => {
    if (id) {
      const res = loadResume(id);
      if (!res) {
        navigate('/resumes');
      }
    }
  }, [id, loadResume, navigate]);

  if (!currentResume) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-forge-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-forge-600">Loading resume in ATS editor...</p>
      </div>
    );
  }

  const atsScore = ATSAnalyzer.analyze(currentResume).overallScore;

  // Template switch
  const handleTemplateChange = (tpl: TemplateId) => {
    updateCurrentResume((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        template: tpl,
      },
    }));
  };

  // Font switch
  const handleFontChange = (font: ResumeData['meta']['fontFamily']) => {
    updateCurrentResume((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        fontFamily: font,
      },
    }));
  };

  // Trigger Honest Bullet Improver (Section 23, 24)
  const handleTriggerBulletImprover = async (
    bullet: string,
    section: string,
    title: string,
    onApply: (newText: string) => void
  ) => {
    if (!StorageService.hasAcceptedAIPrivacy()) {
      setAiPrivacyModalOpen(true);
      return;
    }

    setActiveBullet({ original: bullet, section, title, onApply });
    setBulletModalOpen(true);
    setAiLoading(true);

    try {
      const result = await AIService.improveBullet(
        bullet,
        { section, title },
        null as any
      );
      setAiSuggestions(result.suggestions);
    } catch (err: any) {
      alert(`AI Notice: ${err.message}`);
      setBulletModalOpen(false);
    } finally {
      setAiLoading(false);
    }
  };

  // Export Resume JSON (Section 16)
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentResume, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `${currentResume.title.toLowerCase().replace(/\s+/g, '_')}_resume.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Vector PDF Download (Section 3)
  const handleDownloadPDF = async () => {
    setIsExporting(true);
    try {
      await downloadResumePDF(currentResume);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.error('PDF generation error:', e);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-dvh bg-forge-50 dark:bg-[#08090a] flex flex-col text-left transition-colors duration-150">
      {/* Top Editor Bar */}
      <header className="bg-white/90 dark:bg-[#08090a]/90 backdrop-blur-md border-b border-forge-200 dark:border-white/[0.07] sticky top-16 z-30 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs no-print">
        {/* Left: Back & Title & Autosave status */}
        <div className="flex items-center space-x-3">
          <Link
            to="/resumes"
            aria-label="Back to resumes"
            className="p-1.5 rounded-lg text-forge-500 hover:text-forge-900 dark:hover:text-white hover:bg-forge-100 dark:hover:bg-white/[0.06] transition-colors"
            title="Back to resumes"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={currentResume.title}
                onChange={(e) =>
                  updateCurrentResume((prev) => ({ ...prev, title: e.target.value }))
                }
                className="text-sm font-extrabold text-forge-900 dark:text-white bg-transparent hover:bg-forge-50 dark:hover:bg-white/[0.05] px-1 py-0.5 rounded border border-transparent hover:border-forge-200 dark:hover:border-white/[0.1] focus:border-indigo-500 focus:bg-white dark:focus:bg-[#121316] focus:outline-none"
              />
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-forge-100 dark:bg-white/[0.06] text-forge-700 dark:text-slate-300 rounded font-semibold border border-transparent dark:border-white/[0.08]">
                v{currentResume.meta.version}
              </span>
            </div>

            {/* Autosave Indicator (Section 11) */}
            <div className="flex items-center space-x-1.5 text-[11px] text-forge-500 dark:text-slate-400 px-1">
              {saveStatus === 'saving' && (
                <span className="text-amber-600 dark:text-amber-400 font-medium">Saving...</span>
              )}
              {saveStatus === 'saved' && (
                <span className="text-emerald-700 dark:text-emerald-400 flex items-center space-x-1">
                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Saved</span>
                </span>
              )}
              {saveStatus === 'unsaved' && (
                <span className="text-forge-400 dark:text-slate-500 italic">Unsaved changes</span>
              )}
              {saveStatus === 'error' && (
                <span className="text-rose-600 dark:text-rose-400 font-bold">Save failed</span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Template Gallery & Font Selector */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            type="button"
            onClick={() => setTemplateGalleryOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-[#121316] hover:bg-slate-50 dark:hover:bg-[#1a1b20] border border-forge-200 dark:border-white/[0.08] font-semibold transition-colors shadow-2xs cursor-pointer"
            title="Browse all 10 professional ATS templates"
          >
            <Layout className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline text-forge-500 dark:text-slate-400 font-normal">Template:</span>
            <span className="capitalize font-bold">{currentResume.meta.template}</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
              {getAllTemplates().length}
            </span>
          </button>

          <div className="hidden xl:flex items-center space-x-1.5">
            <span className="text-forge-500 dark:text-slate-400 font-medium">Font:</span>
            <select
              value={currentResume.meta.fontFamily}
              onChange={(e) => handleFontChange(e.target.value as any)}
              className="text-xs p-1.5 border border-forge-300 dark:border-white/[0.08] rounded-lg font-semibold bg-white dark:bg-[#121316] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Inter">Inter (Clean modern)</option>
              <option value="Arial">Arial (Standard sans)</option>
              <option value="Times New Roman">Times New Roman (Academic)</option>
              <option value="Georgia">Georgia (Serif)</option>
              <option value="Consolas">Consolas (Code font)</option>
            </select>
          </div>
        </div>

        {/* Right Actions: Clean, uncluttered toolbar */}
        <div className="flex items-center space-x-2">
          {/* ATS mini score badge */}
          <Link
            to={`/analyzer/${currentResume.id}`}
            title="Open comprehensive ATS compatibility analyzer"
            className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
          >
            <FileCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span><span className="tabular-nums">{atsScore}</span>% ATS</span>
          </Link>

          {/* Versions */}
          <button
            onClick={() => setVersionModalOpen(true)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-forge-700 dark:text-slate-200 hover:text-forge-900 dark:hover:text-white bg-white dark:bg-[#121316] hover:bg-forge-100 dark:hover:bg-[#1a1b20] border border-forge-200 dark:border-white/[0.08] text-xs font-semibold transition-colors"
            title="Version History & Snapshots"
          >
            <History className="w-3.5 h-3.5 text-forge-500 dark:text-slate-400" />
            <span className="hidden md:inline">Snapshots</span>
          </button>

          {/* More Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreToolsOpen(!moreToolsOpen)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-forge-700 dark:text-slate-200 hover:text-forge-900 dark:hover:text-white bg-white dark:bg-[#121316] hover:bg-forge-50 dark:hover:bg-[#1a1b20] border border-forge-200 dark:border-white/[0.08] text-xs font-semibold transition-colors"
              title="More Tools"
            >
              <span>Tools</span>
              <ChevronDown className="w-3 h-3 text-forge-400 dark:text-slate-500" />
            </button>

            {moreToolsOpen && (
              <div 
                className="absolute right-0 mt-1 w-48 bg-white dark:bg-[#121316] border border-forge-200 dark:border-white/[0.08] rounded-xl shadow-lg p-1.5 z-40 text-xs text-left animate-fade-in"
                onMouseLeave={() => setMoreToolsOpen(false)}
              >
                <button
                  onClick={() => {
                    handleAutoFitOnePage();
                    setMoreToolsOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-forge-50 dark:hover:bg-white/[0.06] text-forge-800 dark:text-slate-200 font-medium flex items-center space-x-2"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>1-Page Smart Fit</span>
                </button>

                <button
                  onClick={() => {
                    setPersonaModalOpen(true);
                    setMoreToolsOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-forge-50 dark:hover:bg-white/[0.06] text-forge-800 dark:text-slate-200 font-medium flex items-center space-x-2"
                >
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Persona Reviews</span>
                </button>

                <button
                  onClick={() => {
                    setScanSimOpen(true);
                    setMoreToolsOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-forge-50 dark:hover:bg-white/[0.06] text-forge-800 dark:text-slate-200 font-medium flex items-center space-x-2"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-400" />
                  <span>6s Recruiter Scan</span>
                </button>

                <div className="my-1 border-t border-forge-100 dark:border-white/[0.07]" />

                <button
                  onClick={() => {
                    handleExportJSON();
                    setMoreToolsOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-forge-50 dark:hover:bg-white/[0.06] text-forge-800 dark:text-slate-200 font-medium flex items-center space-x-2"
                >
                  <Download className="w-3.5 h-3.5 text-forge-400 dark:text-slate-400" />
                  <span>Export JSON</span>
                </button>

                <button
                  onClick={() => {
                    window.print();
                    setMoreToolsOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-forge-50 dark:hover:bg-white/[0.06] text-forge-800 dark:text-slate-200 font-medium flex items-center space-x-2"
                >
                  <Printer className="w-3.5 h-3.5 text-forge-400 dark:text-slate-400" />
                  <span>Print Sheet</span>
                </button>
              </div>
            )}
          </div>

          {/* Live Web Portfolio & Public Resume Preview */}
          <Link
            to="/portfolio"
            target="_blank"
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-forge-700 dark:text-slate-200 hover:text-forge-900 dark:hover:text-white bg-white dark:bg-[#121316] hover:bg-forge-50 dark:hover:bg-[#1a1b20] border border-forge-200 dark:border-white/[0.08] text-xs font-semibold transition-colors"
            title="Preview Live Web Showcase & Portfolio"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            <span className="hidden sm:inline">Preview</span>
          </Link>

          {/* Pure Vector PDF Download */}
          <button
            disabled={isExporting}
            onClick={handleDownloadPDF}
            className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating...' : 'Download PDF'}</span>
          </button>
        </div>
      </header>

      {/* Mobile View Switcher (Visible on mobile & tablet < lg screens) */}
      <div className="lg:hidden w-full max-w-7xl mx-auto px-4 pt-3 pb-1 no-print">
        <div className="flex bg-slate-200/70 dark:bg-white/[0.06] p-1 rounded-xl border border-slate-300/60 dark:border-white/[0.08]">
          <button
            type="button"
            onClick={() => setMobileViewTab('editor')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mobileViewTab === 'editor'
                ? 'bg-white dark:bg-[#16171c] text-slate-950 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Edit Form</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileViewTab('preview')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mobileViewTab === 'preview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live ATS Preview</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Form Editor / Right Live Preview (Section 11) */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Editor Accordion (5 Cols on LG, hidden on mobile when preview active) */}
        <div className={`${mobileViewTab === 'preview' ? 'hidden lg:block' : 'block'} lg:col-span-5 space-y-4 no-print`}>
          {/* Target Company & Role ATS Customization Panel */}
          <JobCustomizationPanel resume={currentResume} onUpdateResume={(updated) => updateCurrentResume(() => updated)} />

          {/* Section Management Card */}
          <SectionManager resume={currentResume} onUpdate={updateCurrentResume} />

          {/* Section Accordions Form Manager */}
          <ResumeFormManager
            currentResume={currentResume}
            updateCurrentResume={updateCurrentResume}
            activeAccordion={activeAccordion}
            setActiveAccordion={setActiveAccordion}
            getBulletTelemetry={getBulletTelemetry}
            handleTriggerBulletImprover={handleTriggerBulletImprover}
            handleOpenXyzFormula={(initialBullet, onApply) => {
              setActiveXyzTarget({
                initialBullet,
                onApply,
              });
              setXyzModalOpen(true);
            }}
          />
        </div>

        {/* Right Column: Live ATS Preview (7 Cols on LG, hidden on mobile when editor active) */}
        <div className={`${mobileViewTab === 'editor' ? 'hidden lg:flex' : 'flex'} lg:col-span-7 flex-col items-center w-full`}>
          <div className="w-full sticky top-32">
            {/* Live Preview Controls Header */}
            <div className="mb-2 flex items-center justify-between text-xs text-forge-500 dark:text-slate-400 px-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-forge-800 dark:text-white">Live Vector Document</span>
                <span className="text-[10px] text-forge-400 dark:text-slate-500">• Single Column AST</span>
              </div>

              {/* Dynamic Zoom & Inspector Toolbar */}
              <div className="flex items-center space-x-2">
                {/* ATS Inspector Toggle */}
                <button
                  type="button"
                  onClick={() => setAtsInspectorActive(!atsInspectorActive)}
                  className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                    atsInspectorActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white dark:bg-[#121316] hover:bg-forge-100 dark:hover:bg-[#1a1b20] text-forge-700 dark:text-slate-200 border border-forge-300 dark:border-white/[0.08]'
                  }`}
                  title="Toggle AST Natural Reading Order Inspector"
                >
                  <Scan className="w-3.5 h-3.5" />
                  <span>ATS Inspector</span>
                </button>

                {/* Zoom Controls */}
                <div className="flex items-center space-x-1 bg-white dark:bg-[#121316] border border-forge-300 dark:border-white/[0.08] rounded-md p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setPreviewScale((prev) => Math.max(0.6, prev - 0.1))}
                    className="p-1 hover:bg-forge-100 dark:hover:bg-white/[0.06] rounded text-forge-600 dark:text-slate-400"
                    title="Zoom out"
                    aria-label="Zoom out preview"
                  >
                    <ZoomOut className="w-3 h-3" />
                  </button>
                  <span className="font-mono font-semibold px-1 text-forge-700 dark:text-slate-300 text-[10px] tabular-nums">
                    {Math.round(previewScale * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewScale((prev) => Math.min(1.4, prev + 0.1))}
                    className="p-1 hover:bg-forge-100 dark:hover:bg-white/[0.06] rounded text-forge-600 dark:text-slate-400"
                    title="Zoom in"
                    aria-label="Zoom in preview"
                  >
                    <ZoomIn className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewScale(1)}
                    className="px-1 text-[10px] hover:bg-forge-100 dark:hover:bg-white/[0.06] rounded text-forge-500 dark:text-slate-400 font-semibold"
                    title="Reset to 100%"
                    aria-label="Reset zoom to 100%"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Document Render Container with Inspector Overlay */}
            <div className="relative border border-forge-300 dark:border-white/[0.08] rounded-xl overflow-auto p-4 bg-slate-200/80 dark:bg-[#050607] shadow-inner max-h-[85vh] flex justify-center">
              <ATSInspectorOverlay resume={currentResume} active={atsInspectorActive} />
              <ResumeDocument resume={currentResume} scale={previewScale} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Privacy Notice Modal (Section 30) */}
      <AIPrivacyModal
        isOpen={aiPrivacyModalOpen}
        onAccept={() => {
          setAiPrivacyModalOpen(false);
          if (activeBullet) {
            handleTriggerBulletImprover(
              activeBullet.original,
              activeBullet.section,
              activeBullet.title,
              activeBullet.onApply
            );
          }
        }}
        onCancel={() => setAiPrivacyModalOpen(false)}
      />

      {/* Bullet Improver Modal (Section 23, 24) */}
      {activeBullet && (
        <BulletImproverModal
          isOpen={bulletModalOpen}
          originalBullet={activeBullet.original}
          suggestions={aiSuggestions}
          loading={aiLoading}
          onAccept={(suggestedText) => {
            activeBullet.onApply(suggestedText);
          }}
          onClose={() => setBulletModalOpen(false)}
        />
      )}

      {/* Version History Modal (Section 14) */}
      <VersionHistoryModal
        isOpen={versionModalOpen}
        resume={currentResume}
        versions={versions}
        onCreateVersion={(name, note) => createVersionSnapshot(name, note)}
        onRestoreVersion={(versionId) => restoreVersion(versionId)}
        onClose={() => setVersionModalOpen(false)}
      />

      {/* Human Persona Testing Modal */}
      <PersonaTestingModal
        isOpen={personaModalOpen}
        resume={currentResume}
        onClose={() => setPersonaModalOpen(false)}
        onApplyFix={handleApplyPersonaFix}
      />

      {/* Google XYZ Formula Generator Modal */}
      {activeXyzTarget && (
        <XYZFormulaModal
          isOpen={xyzModalOpen}
          initialBullet={activeXyzTarget.initialBullet}
          onApply={activeXyzTarget.onApply}
          onClose={() => {
            setXyzModalOpen(false);
            setActiveXyzTarget(null);
          }}
        />
      )}

      {/* Recruiter 6-Second Scan Simulator */}
      <RecruiterScanSimulator
        isOpen={scanSimOpen}
        resume={currentResume}
        onClose={() => setScanSimOpen(false)}
      />

      {/* 10 Professional ATS Templates Gallery Modal */}
      <TemplateGalleryModal
        isOpen={templateGalleryOpen}
        selectedTemplateId={currentResume.meta.template}
        onSelectTemplate={(tplId) => {
          handleTemplateChange(tplId);
          setTemplateGalleryOpen(false);
        }}
        onClose={() => setTemplateGalleryOpen(false)}
      />
    </div>
  );
};
