import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowLeft, 
  Target, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  Sparkles 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { useToast } from '../components/common/Toast';
import { 
  JobFitResult, 
  CareerStorageService, 
  evaluateJobFit 
} from '../modules/careerSuite';

export const JobMatchRadarPage: React.FC = () => {
  const { resumes, masterProfile } = useWorkspace();
  const { showToast } = useToast();

  const [role, setRole] = useState('Senior Full-Stack Engineer');
  const [company, setCompany] = useState('Stripe');
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState(
    `We are looking for a Senior Full-Stack Engineer to build reliable financial infrastructure. Requirements:
- 4+ years of professional software engineering experience
- Strong proficiency in TypeScript, React, Node.js, and PostgreSQL
- Experience designing resilient REST APIs and distributed workflows
- Familiarity with Docker, CI/CD, and AWS cloud environments
- Passion for user experience, performance optimization, and clean architecture
- Remote or hybrid work arrangement`
  );

  const [activeFit, setActiveFit] = useState<JobFitResult>(() => {
    return evaluateJobFit({
      role: 'Senior Full-Stack Engineer',
      company: 'Stripe',
      jobDescription: `TypeScript, React, Node.js, PostgreSQL, Docker, AWS, REST API, Testing`,
      masterProfile: masterProfile || undefined
    });
  });

  const [recentEvaluations, setRecentEvaluations] = useState<JobFitResult[]>([]);

  useEffect(() => {
    const list = CareerStorageService.getJobFits();
    setRecentEvaluations(list);
    if (list.length > 0) {
      setActiveFit(list[0]);
      setRole(list[0].role);
      setCompany(list[0].company);
      setJobDescription(list[0].jobDescription);
    }
  }, []);

  const handleEvaluate = () => {
    const selectedResume = resumes.find(r => r.id === selectedResumeId);
    const result = evaluateJobFit({
      role,
      company,
      jobDescription,
      resumeData: selectedResume,
      masterProfile: masterProfile || undefined
    });

    setActiveFit(result);
    CareerStorageService.saveJobFit(result);
    setRecentEvaluations(CareerStorageService.getJobFits());
    showToast('Job fit evaluation completed!', 'success');
  };

  const getActionBadge = (action: JobFitResult['recommendedAction']) => {
    switch (action) {
      case 'STRONG_APPLY':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Strong Apply (High Fit)
          </span>
        );
      case 'GOOD_MATCH':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-300/60 dark:border-indigo-700/60 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
            Good Match (Competitive)
          </span>
        );
      case 'STRETCH_ROLE':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Stretch Opportunity
          </span>
        );
      case 'DISQUALIFIED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300/60 dark:border-rose-700/60 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Hard Gate Veto (Disqualified)
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border border-orange-300/60 dark:border-orange-700/60 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
            Caution (Key Gaps)
          </span>
        );
    }
  };

  const getGateBadge = (status: 'PASS' | 'FAIL' | 'FLAG') => {
    switch (status) {
      case 'PASS':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            PASS
          </span>
        );
      case 'FAIL':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            FAIL
          </span>
        );
      case 'FLAG':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            FLAG / VERIFY
          </span>
        );
    }
  };

  const dimensions = [
    { label: 'Technical Skills Alignment', score: activeFit.scores.technicalSkills, weight: '30%' },
    { label: 'Experience & Scope Match', score: activeFit.scores.experienceMatch, weight: '25%' },
    { label: 'Behavioral & Working Style', score: activeFit.scores.behavioralCulture, weight: '15%' },
    { label: 'Location & Work Logistics', score: activeFit.scores.locationLogistics, weight: '15%' },
    { label: 'Career Alignment & Trajectory', score: activeFit.scores.careerAlignment, weight: '15%' },
  ];

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16">
      {/* Top Banner */}
      <div className="border-b border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/60 sticky top-16 z-30 backdrop-blur-md">
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
                <span className="text-xs text-slate-500 dark:text-slate-400">5-Dimensional Evaluation</span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-500" />
                Job Opportunity Radar & Fit Scorer
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {recentEvaluations.length > 0 && (
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {recentEvaluations.length} evaluated
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Input & Evaluation Form */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Evaluate Job Posting
            </h2>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Evaluates Eligibility, Language & 5 Skill Dimensions
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
                Source Resume / Profile
              </label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
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
              Job Description Text
            </label>
            <textarea
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste full job posting or requirements here..."
              className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 font-mono"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleEvaluate}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Target className="w-3.5 h-3.5" />
              Run 5-Dimensional Evaluation
            </button>
          </div>
        </div>

        {/* Pre-Scoring Hard Gates Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono flex items-center gap-1.5">
              <ShieldCheckIcon className="w-4 h-4 text-indigo-500" />
              Pre-Evaluation Qualification Gates
            </h3>
            <span className="text-[11px] text-slate-400">Strict eligibility check before scoring</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Eligibility Gate */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-white/[0.05] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  1. Work Rights & Clearance Gate
                </span>
                {getGateBadge(activeFit.gates.eligibility.status)}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {activeFit.gates.eligibility.reason}
              </p>
              {activeFit.gates.eligibility.quotedRequirement && (
                <div className="text-[11px] text-slate-500 italic bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800">
                  "{activeFit.gates.eligibility.quotedRequirement}"
                </div>
              )}
            </div>

            {/* Language Gate */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-white/[0.05] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  2. Working Language Gate
                </span>
                {getGateBadge(activeFit.gates.language.status)}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {activeFit.gates.language.reason}
              </p>
              {activeFit.gates.language.quotedRequirement && (
                <div className="text-[11px] text-slate-500 italic bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800">
                  "{activeFit.gates.language.quotedRequirement}"
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 5-Dimensional Fit Score Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/[0.04]">
            <div className="flex items-center space-x-4">
              <div className="size-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/60 flex flex-col items-center justify-center">
                <span className="text-2xl font-black tabular-nums text-indigo-600 dark:text-indigo-400 font-display">
                  {activeFit.scores.overallFitScore}
                </span>
                <span className="text-[9px] uppercase font-mono font-bold text-slate-400">/ 100</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Overall Fit Score: {activeFit.role} at {activeFit.company}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Weighted across 5 dimensions derived from candidate profile vs job description
                </p>
              </div>
            </div>

            <div>
              {getActionBadge(activeFit.recommendedAction)}
            </div>
          </div>

          {/* Dimension Progress Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {dimensions.map((dim, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {dim.label} <span className="text-[10px] text-slate-400 font-mono">({dim.weight})</span>
                  </span>
                  <span className="font-mono font-bold tabular-nums text-indigo-600 dark:text-indigo-400">
                    {dim.score}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${dim.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Differential Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Matched Skills */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Verified Matched Skills ({activeFit.matchedSkills.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {activeFit.matchedSkills.length > 0 ? (
                activeFit.matchedSkills.map((skill: string, i: number) => (
                  <span 
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 font-mono"
                  >
                    ✓ {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No specific overlap detected yet.</span>
              )}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 font-mono flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Missing / Undeclared Skills ({activeFit.missingSkills.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {activeFit.missingSkills.length > 0 ? (
                activeFit.missingSkills.map((skill: string, i: number) => (
                  <span 
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60 font-mono"
                  >
                    ! {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">100% of detected technical skills matched!</span>
              )}
            </div>
          </div>
        </div>

        {/* Strengths & Risks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              Key Strengths to Emphasize
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              {activeFit.strengths.map((str: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              Potential Gaps & Questions to Address
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              {activeFit.gapsAndRisks.length > 0 ? (
                activeFit.gapsAndRisks.map((gap: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{gap}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-emerald-600">No high-risk red flags detected.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Action Bar: Next Steps */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold">Ready to apply or prepare for this role?</h3>
            <p className="text-xs text-indigo-200">
              Take action directly with our integrated AI career accelerators.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/cover-letters"
              className="px-3.5 py-2 rounded-xl bg-white text-indigo-950 font-semibold text-xs hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              Draft Tailored Cover Letter
            </Link>
            <Link
              to="/interview-prep"
              className="px-3.5 py-2 rounded-xl bg-indigo-700 text-white font-semibold text-xs hover:bg-indigo-600 transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Prep STAR Interview Answers
            </Link>
            <Link
              to="/upskilling"
              className="px-3.5 py-2 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-700 transition-colors flex items-center gap-1.5 border border-white/10"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Build Upskilling Plan
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

function ShieldCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  );
}
