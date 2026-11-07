import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  HelpCircle, 
  ShieldCheck, 
  Code2, 
  MessageSquare, 
  Copy, 
  Check, 
  Printer, 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Tag,
  Lightbulb
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { useToast } from '../components/common/Toast';
import { 
  InterviewPrepData, 
  StarStory,
  ToughQuestion,
  TechnicalProbe,
  ReverseQuestion,
  CareerStorageService, 
  generateInterviewPrep 
} from '../modules/careerSuite';
import { requestCareerAI } from '../modules/careerSuite/careerAiService';

export const InterviewPrepPage: React.FC = () => {
  const { resumes, masterProfile } = useWorkspace();
  const { showToast } = useToast();
  const location = useLocation();
  const jobContext = location.state as { company?: string; role?: string; jobDescription?: string } | null;

  const [role, setRole] = useState(jobContext?.role || '');
  const [company, setCompany] = useState(jobContext?.company || '');
  const [jobDescription, setJobDescription] = useState(jobContext?.jobDescription || '');
  const [selectedResumeId, setSelectedResumeId] = useState('');

  const [activePrep, setActivePrep] = useState<InterviewPrepData>(() => {
    return generateInterviewPrep({
      role: jobContext?.role || '',
      company: jobContext?.company || '',
      jobDescription: jobContext?.jobDescription || '',
      masterProfile: masterProfile || undefined
    });
  });

  const [activeTab, setActiveTab] = useState<'star' | 'tough' | 'technical' | 'reverse'>('star');
  const [expandedStoryId, setExpandedStoryId] = useState<string | null>(null);
  const [copiedQuestion, setCopiedQuestion] = useState<string | null>(null);

  useEffect(() => {
    const saved = CareerStorageService.getInterviewPreps();
    if (jobContext) {
      setRole(jobContext.role || '');
      setCompany(jobContext.company || '');
      setJobDescription(jobContext.jobDescription || '');
    } else if (saved.length > 0) {
      setActivePrep(saved[0]);
      setRole(saved[0].role);
      setCompany(saved[0].company);
      setJobDescription(saved[0].jobDescription);
    }
  }, [location.state]);

  const handleGenerate = async () => {
    if (!role.trim()) {
      showToast('Please specify a target role before generating interview prep.', 'error');
      return;
    }
    const selectedResume = resumes.find(r => r.id === selectedResumeId);
    const newPrep = generateInterviewPrep({
      role, company, jobDescription, resumeData: selectedResume, masterProfile: masterProfile || undefined
    });
    try {
      const aiDraft = await requestCareerAI('GENERATE_INTERVIEW_PREP', {
        instruction: 'Return JSON with toughQuestions, technicalProbes, and reverseQuestions arrays. Generate role-specific questions and coaching prompts only. Do not invent candidate work history, STAR stories, achievements, metrics, or personal answers. Use STAR story prompts already supplied by the application; do not create any candidate claims.',
        role, company, jobDescription,
        candidateFacts: {
          skills: masterProfile?.skills || selectedResume?.skills || {},
          projects: masterProfile?.projects || selectedResume?.projects || [],
          experience: masterProfile?.experience || selectedResume?.work || []
        }
      });
      if (aiDraft) {
        const safePrep: InterviewPrepData = {
          ...newPrep,
          toughQuestions: Array.isArray(aiDraft.toughQuestions) ? aiDraft.toughQuestions as ToughQuestion[] : newPrep.toughQuestions,
          technicalProbes: Array.isArray(aiDraft.technicalProbes) ? aiDraft.technicalProbes as TechnicalProbe[] : newPrep.technicalProbes,
          reverseQuestions: Array.isArray(aiDraft.reverseQuestions) ? aiDraft.reverseQuestions as ReverseQuestion[] : newPrep.reverseQuestions
        };
        setActivePrep(safePrep);
        CareerStorageService.saveInterviewPrep(safePrep);
        showToast('AI interview guide generated. STAR examples remain grounded in your saved evidence.', 'success');
        return;
      }
    } catch (error) {
      console.warn('Career AI unavailable; using evidence-based local interview guide.', error);
    }
    setActivePrep(newPrep);
    CareerStorageService.saveInterviewPrep(newPrep);
    showToast('Interview preparation guide generated from your saved profile.', 'info');
  };

  const handleSaveNotes = (notes: string) => {
    const updated = { ...activePrep, practiceNotes: notes };
    setActivePrep(updated);
    CareerStorageService.saveInterviewPrep(updated);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestion(id);
    setTimeout(() => setCopiedQuestion(null), 2000);
    showToast('Copied to clipboard!', 'success');
  };

  const toggleStory = (id: string) => {
    setExpandedStoryId(expandedStoryId === id ? null : id);
  };

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16">
      {/* Top Banner */}
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
                <span className="text-xs text-slate-500 dark:text-slate-400">STAR Method Simulator</span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-500" />
                Interview Prep & STAR Simulator
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Cheat Sheet
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Role & JD Config Card */}
        <div className="no-print bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Target Opportunity Details
              </h2>
            </div>
            <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
              Verified Candidate Experience
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Target Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Stripe, Linear"
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Source Resume
              </label>
              <select
                value={selectedResumeId}
                onChange={(e) => {
                  const rId = e.target.value;
                  setSelectedResumeId(rId);
                  const found = resumes.find(r => r.id === rId);
                  if (found) {
                    if (found.targetRole) setRole(found.targetRole);
                    if (found.targetCompany) setCompany(found.targetCompany);
                  }
                }}
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              >
                <option value="">Default Profile</option>
                {resumes.map(r => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Job Description (Paste requirements to generate customized technical probes)
            </label>
            <textarea
              rows={2}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste relevant job description lines..."
              className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate Complete Interview Simulator
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="no-print flex border-b border-slate-200 dark:border-slate-800 space-x-6">
          <button
            onClick={() => setActiveTab('star')}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'star'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            STAR Stories ({activePrep.starStories.length})
          </button>
          <button
            onClick={() => setActiveTab('tough')}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'tough'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Tough Questions Coach ({activePrep.toughQuestions.length})
          </button>
          <button
            onClick={() => setActiveTab('technical')}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'technical'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Technical Probes ({activePrep.technicalProbes.length})
          </button>
          <button
            onClick={() => setActiveTab('reverse')}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'reverse'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Questions to Ask Interviewers ({activePrep.reverseQuestions.length})
          </button>
        </div>

        {/* Tab 1: STAR Stories */}
        {activeTab === 'star' && (
          <div className="space-y-4">
            <div className="bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-3">
              <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">The STAR Methodology:</strong> Structure your answers in 90 to 120 seconds.
                Cover the <strong>Situation</strong> (15s), <strong>Task</strong> (15s), <strong>Action</strong> (60s), and <strong>Result</strong> (30s).
                All stories below are pulled directly from your verified background to ensure zero fabrication.
              </div>
            </div>

            <div className="space-y-4">
              {activePrep.starStories.map((story: StarStory) => {
                const isExpanded = expandedStoryId === story.id;
                return (
                  <div 
                    key={story.id} 
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xs overflow-hidden transition-all"
                  >
                    <div 
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      onClick={() => toggleStory(story.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleStory(story.id);
                        }
                      }}
                      className="p-5 flex items-start justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 focus:outline-none focus:bg-slate-50/80 dark:focus:bg-slate-800/60"
                    >
                      <div className="space-y-1 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md border border-indigo-200/50 dark:border-indigo-800/50">
                            {story.projectOrRole}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                          "{story.questionTrigger}"
                        </h3>
                      </div>
                      <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 pt-1">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="px-5 pb-6 pt-2 border-t border-slate-100 dark:border-white/[0.04] space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/60 dark:border-white/[0.04] space-y-1">
                            <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide text-[10px]">
                              S — Situation (Context)
                            </span>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                              {story.situation}
                            </p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/60 dark:border-white/[0.04] space-y-1">
                            <span className="font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wide text-[10px]">
                              T — Task (Your Responsibility)
                            </span>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                              {story.task}
                            </p>
                          </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/60 dark:border-white/[0.04] space-y-1 text-xs">
                          <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide text-[10px]">
                            A — Action (Specific tools & methods)
                          </span>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {story.action}
                          </p>
                        </div>

                        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40 space-y-1 text-xs">
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide text-[10px]">
                            R — Result (Measurable outcome & impact)
                          </span>
                          <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                            {story.result}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 pt-2">
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 mr-1">
                            <Tag className="w-3 h-3" /> Competencies:
                          </span>
                          {story.skillsDemonstrated.map((s: string, i: number) => (
                            <span 
                              key={i} 
                              className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md font-mono"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Tough Questions Coach */}
        {activeTab === 'tough' && (
          <div className="space-y-4">
            {activePrep.toughQuestions.map((q: ToughQuestion, idx: number) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/50 dark:border-amber-800/50">
                      Category: {q.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      "{q.question}"
                    </h3>
                  </div>
                  <button
                    onClick={() => handleCopy(q.sampleAnswer, `tough_${idx}`)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-1 cursor-pointer shrink-0"
                    title="Copy Answer"
                  >
                    {copiedQuestion === `tough_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200/60 dark:border-white/[0.04] text-xs space-y-1">
                  <span className="font-semibold text-slate-500 uppercase tracking-wide text-[10px]">
                    Recommended Strategy & Framing:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300">
                    {q.responseStrategy}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs space-y-1">
                  <span className="font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide text-[10px]">
                    Articulate Sample Response:
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 italic leading-relaxed">
                    "{q.sampleAnswer}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Technical Probes */}
        {activeTab === 'technical' && (
          <div className="space-y-4">
            {activePrep.technicalProbes.map((probe: TechnicalProbe, idx: number) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-800/50">
                    {probe.topic}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {probe.predictedQuestion}
                </h3>

                {probe.conceptSummary && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {probe.conceptSummary}
                  </p>
                )}

                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    Key Talking Points & Architecture Highlights:
                  </span>
                  <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    {probe.keyTalkingPoints.map((point: string, i: number) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Reverse Questions */}
        {activeTab === 'reverse' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePrep.reverseQuestions.map((rq: ReverseQuestion, idx: number) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold">
                      Category: {rq.category}
                    </span>
                    <button
                      onClick={() => handleCopy(rq.question, `rev_${idx}`)}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                      title="Copy Question"
                    >
                      {copiedQuestion === `rev_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white leading-snug">
                    "{rq.question}"
                  </h4>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-white/[0.03]">
                  <strong>Why ask:</strong> {rq.rationale}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Practice Notes Box */}
        <div className="no-print bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              Candidate Practice Notes & Talking Reminders
            </h3>
            <span className="text-[10px] text-slate-400">Auto-saved to workspace</span>
          </div>
          <textarea
            rows={3}
            value={activePrep.practiceNotes || ''}
            onChange={(e) => handleSaveNotes(e.target.value)}
            placeholder="Jot down company-specific notes, interviewer names, or metrics you want to remember..."
            className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
          />
        </div>

      </div>
    </div>
  );
};
