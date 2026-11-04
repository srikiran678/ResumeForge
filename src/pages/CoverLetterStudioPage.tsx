import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Printer, 
  Save, 
  Plus, 
  Trash2, 
  ArrowLeft,
  Download,
  Settings2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { useToast } from '../components/common/Toast';
import { 
  CoverLetterData, 
  CareerStorageService, 
  generateTailoredCoverLetter, 
  formatCoverLetterAsMarkdown 
} from '../modules/careerSuite';

export const CoverLetterStudioPage: React.FC = () => {
  const { resumes, masterProfile } = useWorkspace();
  const { showToast } = useToast();

  const [savedLetters, setSavedLetters] = useState<CoverLetterData[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  
  // Active Cover Letter State
  const [activeLetter, setActiveLetter] = useState<CoverLetterData>(() => {
    return generateTailoredCoverLetter({
      candidateName: masterProfile?.personalInfo?.fullName || 'Alex Morgan',
      candidateEmail: masterProfile?.personalInfo?.email || 'alex.morgan@example.com',
      candidatePhone: masterProfile?.personalInfo?.phone || '+1 (555) 019-2834',
      candidateLocation: masterProfile?.personalInfo?.location || 'San Francisco, CA',
      candidateLinkedIn: masterProfile?.personalInfo?.linkedIn || 'linkedin.com/in/alexmorgan',
      role: 'Senior Full-Stack Engineer',
      company: 'Stripe',
      jobDescription: '',
      masterProfile: masterProfile || undefined
    });
  });

  const [copiedType, setCopiedType] = useState<'text' | 'md' | null>(null);

  useEffect(() => {
    const letters = CareerStorageService.getCoverLetters();
    setSavedLetters(letters);
    if (letters.length > 0) {
      setActiveLetter(letters[0]);
    }
  }, []);

  const handleSelectResume = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rId = e.target.value;
    setSelectedResumeId(rId);
    const selectedResume = resumes.find(r => r.id === rId);
    if (selectedResume) {
      setActiveLetter(prev => ({
        ...prev,
        senderName: selectedResume.basics.name || prev.senderName,
        senderEmail: selectedResume.basics.email || prev.senderEmail,
        senderPhone: selectedResume.basics.phone || prev.senderPhone,
        senderLocation: selectedResume.basics.location || prev.senderLocation,
        senderLinkedIn: selectedResume.basics.profiles?.find(p => p.network.toLowerCase().includes('linkedin'))?.url || prev.senderLinkedIn,
        role: selectedResume.targetRole || prev.role,
        company: selectedResume.targetCompany || prev.company,
      }));
    }
  };

  const handleGenerate = () => {
    if (!activeLetter.role.trim() || !activeLetter.company.trim()) {
      showToast('Please specify both a target role and company name before generating.', 'error');
      return;
    }
    const selectedResume = resumes.find(r => r.id === selectedResumeId);
    const candidateName = selectedResume?.basics?.name || masterProfile?.personalInfo?.fullName || 'Candidate Name';
    const candidateEmail = selectedResume?.basics?.email || masterProfile?.personalInfo?.email || 'candidate@example.com';
    const candidatePhone = selectedResume?.basics?.phone || masterProfile?.personalInfo?.phone;
    const candidateLocation = selectedResume?.basics?.location || masterProfile?.personalInfo?.location;
    const candidateLinkedIn = selectedResume?.basics?.profiles?.find(p => p.network.toLowerCase().includes('linkedin'))?.url || masterProfile?.personalInfo?.linkedIn;

    const newLetter = generateTailoredCoverLetter({
      candidateName,
      candidateEmail,
      candidatePhone,
      candidateLocation,
      candidateLinkedIn,
      role: activeLetter.role,
      company: activeLetter.company,
      jobDescription: activeLetter.jobDescription,
      resumeData: selectedResume,
      masterProfile: masterProfile || undefined,
      recipientName: activeLetter.recipientName
    });

    setActiveLetter(newLetter);
    showToast('Tailored cover letter generated from profile!', 'success');
  };

  const handleSave = () => {
    CareerStorageService.saveCoverLetter(activeLetter);
    const updated = CareerStorageService.getCoverLetters();
    setSavedLetters(updated);
    showToast('Cover letter saved to your workspace.', 'success');
  };

  const handleDelete = (id: string) => {
    CareerStorageService.deleteCoverLetter(id);
    const updated = CareerStorageService.getCoverLetters();
    setSavedLetters(updated);
    if (activeLetter.id === id) {
      if (updated.length > 0) {
        setActiveLetter(updated[0]);
      } else {
        handleGenerate();
      }
    }
    showToast('Cover letter deleted.', 'info');
  };

  const handleCopyMarkdown = () => {
    const md = formatCoverLetterAsMarkdown(activeLetter);
    navigator.clipboard.writeText(md);
    setCopiedType('md');
    setTimeout(() => setCopiedType(null), 2000);
    showToast('Markdown copied to clipboard!', 'success');
  };

  const handleCopyText = () => {
    const text = `${activeLetter.salutation}\n\n${activeLetter.openingParagraph}\n\n${activeLetter.bodyParagraph}\n\n${activeLetter.achievementBullets.map((b: string) => `• ${b}`).join('\n')}\n\n${activeLetter.companyConnectionParagraph}\n\n${activeLetter.closingParagraph}\n\n${activeLetter.signoff}\n${activeLetter.senderName}`;
    navigator.clipboard.writeText(text);
    setCopiedType('text');
    setTimeout(() => setCopiedType(null), 2000);
    showToast('Plain text copied to clipboard!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleUpdateBullet = (index: number, val: string) => {
    const nextBullets = [...activeLetter.achievementBullets];
    nextBullets[index] = val;
    setActiveLetter({ ...activeLetter, achievementBullets: nextBullets });
  };

  const handleAddBullet = () => {
    setActiveLetter({
      ...activeLetter,
      achievementBullets: [...activeLetter.achievementBullets, 'Engineered high-performance feature workflow improving user velocity and reliability.']
    });
  };

  const handleRemoveBullet = (index: number) => {
    const nextBullets = activeLetter.achievementBullets.filter((_, i: number) => i !== index);
    setActiveLetter({ ...activeLetter, achievementBullets: nextBullets });
  };

  const fontClass = activeLetter.fontFamily === 'serif' 
    ? 'font-serif' 
    : activeLetter.fontFamily === 'mono' 
      ? 'font-mono' 
      : 'font-sans';

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16">
      {/* Top Banner / Breadcrumb */}
      <div className="no-print border-b border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/60 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link 
              to="/dashboard"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
                  Career Suite
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">ATS Forward-Looking</span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                Cover Letter Studio
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-slate-500" />
              Save
            </button>
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedType === 'text' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              Copy Text
            </button>
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedType === 'md' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Download className="w-3.5 h-3.5 text-slate-500" />}
              Markdown
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Main Grid: Controls & Letterhead Paper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form & Targeting Config (no-print) */}
          <div className="no-print lg:col-span-5 space-y-6">
            
            {/* Quick Tailor Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  Targeting & AI Alignment
                </h2>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
                  Zero Hallucination
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Select Source Resume / Profile
                  </label>
                  <select
                    value={selectedResumeId}
                    onChange={handleSelectResume}
                    className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Default Profile ({masterProfile?.personalInfo?.fullName || 'User Profile'})</option>
                    {resumes.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.title} ({r.targetRole || 'General'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Target Role
                    </label>
                    <input
                      type="text"
                      value={activeLetter.role}
                      onChange={(e) => setActiveLetter({ ...activeLetter, role: e.target.value })}
                      placeholder="e.g. Senior Backend Engineer"
                      className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Target Company
                    </label>
                    <input
                      type="text"
                      value={activeLetter.company}
                      onChange={(e) => setActiveLetter({ ...activeLetter, company: e.target.value })}
                      placeholder="e.g. Stripe, Linear"
                      className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Job Description (Optional — for keyword tailoring)
                  </label>
                  <textarea
                    rows={3}
                    value={activeLetter.jobDescription || ''}
                    onChange={(e) => setActiveLetter({ ...activeLetter, jobDescription: e.target.value })}
                    placeholder="Paste job posting details here..."
                    className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGenerate}
                  className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Synthesize & Re-tailor Letter
                </button>
              </div>
            </div>

            {/* Content Editor Accordions */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-indigo-500" />
                Customize Letter Sections
              </h2>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      value={activeLetter.recipientName}
                      onChange={(e) => setActiveLetter({ ...activeLetter, recipientName: e.target.value })}
                      placeholder="e.g. Hiring Team or Jane Smith"
                      className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Typography Style
                    </label>
                    <select
                      value={activeLetter.fontFamily || 'inter'}
                      onChange={(e) => setActiveLetter({ ...activeLetter, fontFamily: e.target.value as any })}
                      className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
                    >
                      <option value="inter">Clean Modern (Inter)</option>
                      <option value="serif">Executive Serif (Georgia)</option>
                      <option value="mono">Technical (Mono)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Opening Paragraph (Hook & Connection)
                  </label>
                  <textarea
                    rows={3}
                    value={activeLetter.openingParagraph}
                    onChange={(e) => setActiveLetter({ ...activeLetter, openingParagraph: e.target.value })}
                    className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Top 3 Concrete Achievement Bullets
                    </label>
                    <button
                      type="button"
                      onClick={handleAddBullet}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Bullet
                    </button>
                  </div>
                  <div className="space-y-2">
                    {activeLetter.achievementBullets.map((bullet: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-xs font-mono font-semibold text-slate-400 pt-2">{idx + 1}.</span>
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={(e) => handleUpdateBullet(idx, e.target.value)}
                          className="flex-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-slate-900 dark:text-slate-100"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveBullet(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                          title="Remove bullet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Company & Culture Connection ("Why this company")
                  </label>
                  <textarea
                    rows={3}
                    value={activeLetter.companyConnectionParagraph}
                    onChange={(e) => setActiveLetter({ ...activeLetter, companyConnectionParagraph: e.target.value })}
                    className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Closing Call to Action
                  </label>
                  <textarea
                    rows={2}
                    value={activeLetter.closingParagraph}
                    onChange={(e) => setActiveLetter({ ...activeLetter, closingParagraph: e.target.value })}
                    className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* Saved Letters Drawer list */}
            {savedLetters.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  Saved Cover Letters ({savedLetters.length})
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {savedLetters.map((letter: CoverLetterData) => (
                    <div
                      key={letter.id}
                      onClick={() => setActiveLetter(letter)}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                        activeLetter.id === letter.id
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="font-semibold truncate">{letter.title || 'Untitled Letter'}</div>
                        <div className="text-[10px] text-slate-400">{letter.company || 'General'} • {letter.date}</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(letter.id);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-500"
                        title="Delete letter"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: High-Fidelity 1-Page Letterhead Paper */}
          <div className="lg:col-span-7">
            <div className="bg-slate-200/60 dark:bg-slate-900/40 p-4 sm:p-8 rounded-3xl border border-slate-300/60 dark:border-white/[0.05] flex justify-center">
              
              {/* The Single-Page ATS Sheet */}
              <div 
                id="cover-letter-paper"
                className={`w-full max-w-[720px] bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-lg border border-slate-200/90 leading-relaxed text-[13px] ${fontClass}`}
                style={{ minHeight: '840px' }}
              >
                {/* Header Information */}
                <div className="border-b border-slate-200 pb-5 mb-6">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
                    {activeLetter.senderName}
                  </h1>
                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>{activeLetter.senderEmail}</span>
                    {activeLetter.senderPhone && <span>• {activeLetter.senderPhone}</span>}
                    {activeLetter.senderLocation && <span>• {activeLetter.senderLocation}</span>}
                    {activeLetter.senderLinkedIn && (
                      <span>• <span className="text-indigo-600">{activeLetter.senderLinkedIn}</span></span>
                    )}
                  </div>
                </div>

                {/* Date & Recipient */}
                <div className="mb-6 text-xs text-slate-600 space-y-1">
                  <div>{activeLetter.date}</div>
                  <div className="font-semibold text-slate-800">{activeLetter.recipientName}</div>
                  {activeLetter.company && <div className="text-slate-700">{activeLetter.company}</div>}
                </div>

                {/* Salutation */}
                <div className="font-semibold text-slate-900 mb-4">
                  {activeLetter.salutation}
                </div>

                {/* Body Paragraphs */}
                <div className="space-y-4 text-slate-800">
                  <p className="leading-relaxed">
                    {activeLetter.openingParagraph}
                  </p>

                  <p className="leading-relaxed">
                    {activeLetter.bodyParagraph}
                  </p>

                  {/* 3 Concrete Achievement Bullets */}
                  <ul className="list-disc pl-5 space-y-2 text-slate-800">
                    {activeLetter.achievementBullets.map((bullet: string, idx: number) => (
                      <li key={idx} className="leading-relaxed pl-1">
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  <p className="leading-relaxed">
                    {activeLetter.companyConnectionParagraph}
                  </p>

                  <p className="leading-relaxed">
                    {activeLetter.closingParagraph}
                  </p>
                </div>

                {/* Sign-off */}
                <div className="mt-8 pt-4">
                  <div className="text-slate-700 mb-6">{activeLetter.signoff}</div>
                  <div className="font-bold text-slate-900">{activeLetter.senderName}</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
