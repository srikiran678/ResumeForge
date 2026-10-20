import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Save, 
  Download, 
  Sparkles, 
  History, 
  Eye, 
  Check, 
  Printer, 
  FileCheck, 
  ArrowLeft, 
  Layers, 
  Plus, 
  Trash2, 
  Copy,
  ChevronDown,
  ChevronUp,
  Settings,
  Share2
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { ResumeDocument } from '../components/resume/ResumeDocument';
import { downloadResumePDF } from '../components/resume/ResumePDF';
import { SectionManager } from '../components/resume/SectionManager';
import { BulletImproverModal } from '../components/resume/BulletImproverModal';
import { VersionHistoryModal } from '../components/resume/VersionHistoryModal';
import { AIPrivacyModal } from '../components/common/AIPrivacyModal';
import { ATSAnalyzer } from '../lib/atsAnalyzer';
import { AIService } from '../lib/aiService';
import { StorageService } from '../lib/storage';
import { ResumeData, TemplateId, AISuggestion } from '../types';
import confetti from 'canvas-confetti';
import { PersonaTestingModal } from '../components/testing/PersonaTestingModal';
import { XYZFormulaModal } from '../components/resume/XYZFormulaModal';
import { RecruiterScanSimulator } from '../components/resume/RecruiterScanSimulator';
import { ATSInspectorOverlay } from '../components/resume/ATSInspectorOverlay';
import { Users, Target, Zap, ZoomIn, ZoomOut, Maximize2, Scan } from 'lucide-react';

export const ResumeEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    loadResume, 
    currentResume, 
    updateCurrentResume, 
    saveCurrentResumeImmediately, 
    saveStatus,
    versions,
    createVersionSnapshot,
    restoreVersion,
    masterProfile
  } = useWorkspace();

  // Active section accordion in editor
  const [activeAccordion, setActiveAccordion] = useState<string>('basics');
  const [previewScale, setPreviewScale] = useState(1);

  // Modals state
  const [versionModalOpen, setVersionModalOpen] = useState(false);
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
        masterProfile
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
    <div className="min-h-screen bg-forge-50 flex flex-col text-left">
      {/* Top Editor Bar */}
      <header className="bg-white border-b border-forge-200 sticky top-16 z-30 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs no-print">
        {/* Left: Back & Title & Autosave status */}
        <div className="flex items-center space-x-3">
          <Link
            to="/resumes"
            className="p-1.5 rounded-lg text-forge-500 hover:text-forge-900 hover:bg-forge-100"
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
                className="text-sm font-extrabold text-forge-900 bg-transparent hover:bg-forge-50 px-1 py-0.5 rounded border border-transparent hover:border-forge-200 focus:border-forge-400 focus:bg-white focus:outline-none"
              />
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-forge-100 text-forge-700 rounded font-semibold">
                v{currentResume.meta.version}
              </span>
            </div>

            {/* Autosave Indicator (Section 11) */}
            <div className="flex items-center space-x-1.5 text-[11px] text-forge-500 px-1">
              {saveStatus === 'saving' && (
                <span className="text-amber-600 font-medium">Saving...</span>
              )}
              {saveStatus === 'saved' && (
                <span className="text-emerald-700 flex items-center space-x-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Saved</span>
                </span>
              )}
              {saveStatus === 'unsaved' && (
                <span className="text-forge-400 italic">Unsaved changes</span>
              )}
              {saveStatus === 'error' && (
                <span className="text-rose-600 font-bold">Save failed</span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Template & Font Selector */}
        <div className="hidden xl:flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="text-forge-500 font-medium">Template:</span>
            <select
              value={currentResume.meta.template}
              onChange={(e) => handleTemplateChange(e.target.value as TemplateId)}
              className="text-xs p-1.5 border border-forge-300 rounded font-semibold bg-white focus:outline-none"
            >
              <option value="classic">Classic (Standard Minimal ATS)</option>
              <option value="compact">Compact (Dense 1-Page Technical)</option>
              <option value="modern">Modern (Refined Typography)</option>
              <option value="academic">Academic (Research & Coursework)</option>
              <option value="hackathon">Hackathon (Tech Badges & Demos)</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-forge-500 font-medium">Font:</span>
            <select
              value={currentResume.meta.fontFamily}
              onChange={(e) => handleFontChange(e.target.value as any)}
              className="text-xs p-1.5 border border-forge-300 rounded font-semibold bg-white focus:outline-none"
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
            className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors"
          >
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{atsScore}% ATS</span>
          </Link>

          {/* Versions */}
          <button
            onClick={() => setVersionModalOpen(true)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-forge-700 hover:text-forge-900 bg-white hover:bg-forge-100 border border-forge-200 text-xs font-semibold"
            title="Version History & Snapshots"
          >
            <History className="w-3.5 h-3.5 text-forge-500" />
            <span className="hidden md:inline">Snapshots</span>
          </button>

          {/* More Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreToolsOpen(!moreToolsOpen)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-forge-700 hover:text-forge-900 bg-white hover:bg-forge-50 border border-forge-200 text-xs font-semibold"
              title="More Tools"
            >
              <span>Tools</span>
              <ChevronDown className="w-3 h-3 text-forge-400" />
            </button>

            {moreToolsOpen && (
              <div 
                className="absolute right-0 mt-1 w-48 bg-white border border-forge-200 rounded-xl shadow-lg p-1.5 z-40 text-xs text-left animate-fade-in"
                onMouseLeave={() => setMoreToolsOpen(false)}
              >
                <button
                  onClick={() => {
                    handleAutoFitOnePage();
                    setMoreToolsOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-forge-50 text-forge-800 font-medium flex items-center space-x-2"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>1-Page Smart Fit</span>
                </button>

                <button
                  onClick={() => {
                    setPersonaModalOpen(true);
                    setMoreToolsOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-forge-50 text-forge-800 font-medium flex items-center space-x-2"
                >
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                  <span>Persona Reviews</span>
                </button>

                <button
                  onClick={() => {
                    setScanSimOpen(true);
                    setMoreToolsOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-forge-50 text-forge-800 font-medium flex items-center space-x-2"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>6s Recruiter Scan</span>
                </button>

                <div className="my-1 border-t border-forge-100" />

                <button
                  onClick={() => {
                    handleExportJSON();
                    setMoreToolsOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-forge-50 text-forge-800 font-medium flex items-center space-x-2"
                >
                  <Download className="w-3.5 h-3.5 text-forge-500" />
                  <span>Export JSON</span>
                </button>

                <button
                  onClick={() => {
                    window.print();
                    setMoreToolsOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-forge-50 text-forge-800 font-medium flex items-center space-x-2"
                >
                  <Printer className="w-3.5 h-3.5 text-forge-500" />
                  <span>Print Sheet</span>
                </button>
              </div>
            )}
          </div>

          {/* Pure Vector PDF Download */}
          <button
            disabled={isExporting}
            onClick={handleDownloadPDF}
            className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating...' : 'Download PDF'}</span>
          </button>
        </div>
      </header>

      {/* Main Split Layout: Left Form Editor / Right Live Preview (Section 11) */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Editor Accordion (5 Cols on LG) */}
        <div className="lg:col-span-5 space-y-4 no-print">
          {/* Section Management Card */}
          <SectionManager resume={currentResume} onUpdate={updateCurrentResume} />

          {/* Accordion 1: Basics & Contact Info */}
          <div className="bg-white border border-forge-200 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() =>
                setActiveAccordion(activeAccordion === 'basics' ? '' : 'basics')
              }
              className="w-full p-4 flex justify-between items-center text-xs font-bold text-forge-900 bg-forge-50/50 hover:bg-forge-50"
            >
              <span>Personal Information & Basics</span>
              {activeAccordion === 'basics' ? (
                <ChevronUp className="w-4 h-4 text-forge-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-forge-400" />
              )}
            </button>

            {activeAccordion === 'basics' && (
              <div className="p-4 space-y-3 border-t border-forge-100 text-xs">
                <div>
                  <label className="block font-semibold text-forge-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={currentResume.basics.name}
                    onChange={(e) =>
                      updateCurrentResume((prev) => ({
                        ...prev,
                        basics: { ...prev.basics, name: e.target.value },
                      }))
                    }
                    className="w-full p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-forge-700 mb-1">Target Headline</label>
                  <input
                    type="text"
                    value={currentResume.basics.label}
                    onChange={(e) =>
                      updateCurrentResume((prev) => ({
                        ...prev,
                        basics: { ...prev.basics, label: e.target.value },
                      }))
                    }
                    className="w-full p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-forge-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={currentResume.basics.email}
                      onChange={(e) =>
                        updateCurrentResume((prev) => ({
                          ...prev,
                          basics: { ...prev.basics, email: e.target.value },
                        }))
                      }
                      className="w-full p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-forge-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={currentResume.basics.phone}
                      onChange={(e) =>
                        updateCurrentResume((prev) => ({
                          ...prev,
                          basics: { ...prev.basics, phone: e.target.value },
                        }))
                      }
                      className="w-full p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-forge-700 mb-1">Location (City, State)</label>
                  <input
                    type="text"
                    value={currentResume.basics.location}
                    onChange={(e) =>
                      updateCurrentResume((prev) => ({
                        ...prev,
                        basics: { ...prev.basics, location: e.target.value },
                      }))
                    }
                    className="w-full p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-forge-700 mb-1">Summary</label>
                  <textarea
                    rows={3}
                    value={currentResume.basics.summary}
                    onChange={(e) =>
                      updateCurrentResume((prev) => ({
                        ...prev,
                        basics: { ...prev.basics, summary: e.target.value },
                      }))
                    }
                    className="w-full p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Accordion 2: Projects & Bullets */}
          <div className="bg-white border border-forge-200 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() =>
                setActiveAccordion(activeAccordion === 'projects' ? '' : 'projects')
              }
              className="w-full p-4 flex justify-between items-center text-xs font-bold text-forge-900 bg-forge-50/50 hover:bg-forge-50"
            >
              <span>Projects ({currentResume.projects.length})</span>
              {activeAccordion === 'projects' ? (
                <ChevronUp className="w-4 h-4 text-forge-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-forge-400" />
              )}
            </button>

            {activeAccordion === 'projects' && (
              <div className="p-4 space-y-4 border-t border-forge-100 text-xs">
                {currentResume.projects.map((proj, pIdx) => (
                  <div key={proj.id} className="p-3 bg-forge-50 rounded-lg border border-forge-200 space-y-2">
                    <div className="flex justify-between font-bold text-forge-900">
                      <span>{proj.name || 'Untitled Project'}</span>
                      <button
                        onClick={() =>
                          updateCurrentResume((prev) => ({
                            ...prev,
                            projects: prev.projects.filter((_, idx) => idx !== pIdx),
                          }))
                        }
                        className="text-forge-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateCurrentResume((prev) => {
                          const updated = [...prev.projects];
                          updated[pIdx].name = val;
                          return { ...prev, projects: updated };
                        });
                      }}
                      className="w-full p-2 border border-forge-300 rounded bg-white text-xs"
                      placeholder="Project Name"
                    />

                    {/* Bullets with Improve Button */}
                    <div className="space-y-1.5 pt-1">
                      <label className="block text-[11px] font-semibold text-forge-600">
                        Highlights & Action Bullets:
                      </label>
                      {proj.highlights.map((h, hIdx) => {
                        const tele = getBulletTelemetry(h);
                        return (
                          <div key={hIdx} className="space-y-1 bg-white p-2.5 rounded-lg border border-forge-200">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-mono text-slate-400">Highlight #{hIdx + 1}</span>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                                  tele.status === 'strong'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : tele.status === 'metric'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-slate-100 text-slate-500 border-slate-200'
                                }`}
                              >
                                {tele.label}
                              </span>
                            </div>
                            <textarea
                              rows={2}
                              value={h}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateCurrentResume((prev) => {
                                  const updated = [...prev.projects];
                                  updated[pIdx].highlights[hIdx] = val;
                                  return { ...prev, projects: updated };
                                });
                              }}
                              className="w-full text-xs p-1.5 border border-forge-200 rounded focus:outline-none"
                            />
                          <div className="flex justify-between items-center text-[10px]">
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleTriggerBulletImprover(
                                    h,
                                    'Projects',
                                    proj.name,
                                    (newText) => {
                                      updateCurrentResume((prev) => {
                                        const updated = [...prev.projects];
                                        updated[pIdx].highlights[hIdx] = newText;
                                        return { ...prev, projects: updated };
                                      });
                                    }
                                  )
                                }
                                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium"
                              >
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                <span>Improve</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveXyzTarget({
                                    initialBullet: h,
                                    onApply: (newBullet) => {
                                      updateCurrentResume((prev) => {
                                        const updated = [...prev.projects];
                                        updated[pIdx].highlights[hIdx] = newBullet;
                                        return { ...prev, projects: updated };
                                      });
                                    },
                                  });
                                  setXyzModalOpen(true);
                                }}
                                className="inline-flex items-center space-x-1 text-slate-500 hover:text-slate-800"
                              >
                                <Target className="w-3 h-3 text-slate-400" />
                                <span>XYZ metric</span>
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                updateCurrentResume((prev) => {
                                  const updated = [...prev.projects];
                                  updated[pIdx].highlights = updated[pIdx].highlights.filter(
                                    (_, idx) => idx !== hIdx
                                  );
                                  return { ...prev, projects: updated };
                                });
                              }}
                              className="text-slate-400 hover:text-rose-600"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => {
                          updateCurrentResume((prev) => {
                            const updated = [...prev.projects];
                            updated[pIdx].highlights.push('Engineered application features.');
                            return { ...prev, projects: updated };
                          });
                        }}
                        className="text-[11px] font-semibold text-forge-700 hover:text-forge-900 pt-1"
                      >
                        + Add bullet
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Accordion 3: Experience & Bullets */}
          <div className="bg-white border border-forge-200 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() =>
                setActiveAccordion(activeAccordion === 'work' ? '' : 'work')
              }
              className="w-full p-4 flex justify-between items-center text-xs font-bold text-forge-900 bg-forge-50/50 hover:bg-forge-50"
            >
              <span>Experience ({currentResume.work.length})</span>
              {activeAccordion === 'work' ? (
                <ChevronUp className="w-4 h-4 text-forge-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-forge-400" />
              )}
            </button>

            {activeAccordion === 'work' && (
              <div className="p-4 space-y-4 border-t border-forge-100 text-xs">
                {currentResume.work.map((exp, eIdx) => (
                  <div key={exp.id} className="p-3 bg-forge-50 rounded-lg border border-forge-200 space-y-2">
                    <div className="flex justify-between font-bold text-forge-900">
                      <span>{exp.position} — {exp.company}</span>
                      <button
                        onClick={() =>
                          updateCurrentResume((prev) => ({
                            ...prev,
                            work: prev.work.filter((_, idx) => idx !== eIdx),
                          }))
                        }
                        className="text-forge-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Bullets with Improve Button */}
                    <div className="space-y-1.5 pt-1">
                      <label className="block text-[11px] font-semibold text-forge-600">
                        Responsibility Bullets:
                      </label>
                      {exp.responsibilities.map((b, bIdx) => {
                        const tele = getBulletTelemetry(b);
                        return (
                          <div key={bIdx} className="space-y-1 bg-white p-2.5 rounded-lg border border-forge-200">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-mono text-slate-400">Bullet #{bIdx + 1}</span>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                                  tele.status === 'strong'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : tele.status === 'metric'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-slate-100 text-slate-500 border-slate-200'
                                }`}
                              >
                                {tele.label}
                              </span>
                            </div>
                            <textarea
                              rows={2}
                              value={b}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateCurrentResume((prev) => {
                                  const updated = [...prev.work];
                                  updated[eIdx].responsibilities[bIdx] = val;
                                  return { ...prev, work: updated };
                                });
                              }}
                              className="w-full text-xs p-1.5 border border-forge-200 rounded focus:outline-none"
                            />
                          <div className="flex justify-between items-center text-[10px]">
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleTriggerBulletImprover(
                                    b,
                                    'Experience',
                                    `${exp.company} (${exp.position})`,
                                    (newText) => {
                                      updateCurrentResume((prev) => {
                                        const updated = [...prev.work];
                                        updated[eIdx].responsibilities[bIdx] = newText;
                                        return { ...prev, work: updated };
                                      });
                                    }
                                  )
                                }
                                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium"
                              >
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                <span>Improve</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveXyzTarget({
                                    initialBullet: b,
                                    onApply: (newBullet) => {
                                      updateCurrentResume((prev) => {
                                        const updated = [...prev.work];
                                        updated[eIdx].responsibilities[bIdx] = newBullet;
                                        return { ...prev, work: updated };
                                      });
                                    },
                                  });
                                  setXyzModalOpen(true);
                                }}
                                className="inline-flex items-center space-x-1 text-slate-500 hover:text-slate-800"
                              >
                                <Target className="w-3 h-3 text-slate-400" />
                                <span>XYZ metric</span>
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                updateCurrentResume((prev) => {
                                  const updated = [...prev.work];
                                  updated[eIdx].responsibilities = updated[eIdx].responsibilities.filter(
                                    (_, idx) => idx !== bIdx
                                  );
                                  return { ...prev, work: updated };
                                });
                              }}
                              className="text-slate-400 hover:text-rose-600"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live ATS Preview (7 Cols on LG) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full sticky top-32">
            {/* Live Preview Controls Header */}
            <div className="mb-2 flex items-center justify-between text-xs text-forge-500 px-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-forge-800">Live Vector Document</span>
                <span className="text-[10px] text-forge-400">• Single Column AST</span>
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
                      : 'bg-white hover:bg-forge-100 text-forge-700 border border-forge-300'
                  }`}
                  title="Toggle AST Natural Reading Order Inspector"
                >
                  <Scan className="w-3.5 h-3.5" />
                  <span>ATS Inspector</span>
                </button>

                {/* Zoom Controls */}
                <div className="flex items-center space-x-1 bg-white border border-forge-300 rounded-md p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setPreviewScale((prev) => Math.max(0.6, prev - 0.1))}
                    className="p-1 hover:bg-forge-100 rounded text-forge-600"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-3 h-3" />
                  </button>
                  <span className="font-mono font-semibold px-1 text-forge-700 text-[10px]">
                    {Math.round(previewScale * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewScale((prev) => Math.min(1.4, prev + 0.1))}
                    className="p-1 hover:bg-forge-100 rounded text-forge-600"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewScale(1)}
                    className="px-1 text-[10px] hover:bg-forge-100 rounded text-forge-500 font-semibold"
                    title="Reset to 100%"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Document Render Container with Inspector Overlay */}
            <div className="relative border border-forge-300 rounded-xl overflow-auto p-4 bg-forge-200 shadow-inner max-h-[85vh] flex justify-center">
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
          masterProfile={masterProfile}
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
    </div>
  );
};
