import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  BookOpen, 
  Code2, 
  CheckCircle2, 
  ExternalLink, 
  ArrowLeft,
  Flame,
  Clock,
  Calendar,
  FolderGit2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { useToast } from '../components/common/Toast';
import { 
  UpskillPlan, 
  SkillGapItem,
  RoadmapSprint,
  CuratedStudyResource,
  CareerStorageService, 
  generateUpskillPlan 
} from '../modules/careerSuite';

export const UpskillingRoadmapPage: React.FC = () => {
  const { masterProfile } = useWorkspace();
  const { showToast } = useToast();

  const [targetRole, setTargetRole] = useState('Senior Full-Stack Engineer');
  const [targetCompany, setTargetCompany] = useState('Stripe');
  const [jobDescription, setJobDescription] = useState(
    'Seeking engineers with deep experience in TypeScript, React, Docker, Kubernetes, AWS, PostgreSQL, and Automated Testing.'
  );

  const [activePlan, setActivePlan] = useState<UpskillPlan>(() => {
    return generateUpskillPlan({
      targetRole: 'Senior Full-Stack Engineer',
      targetCompany: 'Stripe',
      jobDescription: 'TypeScript, React, Docker, Kubernetes, AWS, PostgreSQL, Testing',
      masterProfile: masterProfile || undefined
    });
  });

  useEffect(() => {
    const saved = CareerStorageService.getUpskillPlans();
    if (saved.length > 0) {
      setActivePlan(saved[0]);
      setTargetRole(saved[0].targetRole);
      if (saved[0].targetCompany) setTargetCompany(saved[0].targetCompany);
    }
  }, []);

  const handleGenerate = () => {
    const plan = generateUpskillPlan({
      targetRole,
      targetCompany,
      jobDescription,
      masterProfile: masterProfile || undefined
    });
    setActivePlan(plan);
    CareerStorageService.saveUpskillPlan(plan);
    showToast('Personalized upskilling roadmap generated!', 'success');
  };

  const getPriorityBadge = (priority: 'CRITICAL' | 'HIGH' | 'MEDIUM') => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            CRITICAL GAP
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            HIGH VALUE
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            MEDIUM
          </span>
        );
    }
  };

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
                <span className="text-xs text-slate-500 dark:text-slate-400">Proof-of-Work Roadmaps</span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                Skill Gap & Upskilling Roadmap
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full border border-indigo-200/60 dark:border-indigo-800/60 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Proof-of-Work Centric
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Target Config Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Target Role & Requirements Analysis
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Target Company (Optional)
              </label>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g. Stripe, Linear"
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Job Description / Skill Requirements
            </label>
            <textarea
              rows={3}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste skills or JD lines to extract gap differentials..."
              className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate Sprint Roadmap
            </button>
          </div>
        </div>

        {/* Hard Skill Gaps Grid */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-500" />
              Prioritized Skill Gaps ({activePlan.hardSkillGaps.length})
            </h3>
            <span className="text-[11px] text-slate-400">
              Ranked by job market frequency & impact
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activePlan.hardSkillGaps.map((item: SkillGapItem, idx: number) => (
              <div 
                key={idx}
                className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/70 dark:border-white/[0.05] space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                      {item.skill}
                    </span>
                    {getPriorityBadge(item.priority)}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Demand: {item.marketDemand}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 px-2 py-1 rounded-md">
                  <Clock className="w-3 h-3" />
                  Estimated ramp: {item.learningCurve}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Phase Sprint Roadmap with Proof-of-Work Projects */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              4-Week Actionable Sprint Plan
            </h3>
            <span className="text-[11px] text-slate-400">
              Structured proof-of-work project milestones
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activePlan.sprintRoadmap.map((sprint: RoadmapSprint, idx: number) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-md border border-indigo-200/50 dark:border-indigo-800/50">
                      {sprint.timeframe}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {sprint.phase}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>Goal:</strong> {sprint.goal}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      Weekly Execution Checklist:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      {sprint.actionableSteps.map((step: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Proof of Work Project Box */}
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-indigo-50/50 to-slate-50/80 dark:from-indigo-950/20 dark:to-slate-800/40 border border-indigo-100 dark:border-indigo-900/40 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-300">
                    <FolderGit2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Proof-of-Work Project: {sprint.proofOfWorkProject.title}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {sprint.proofOfWorkProject.description}
                  </p>
                  <div className="text-[11px] text-slate-500">
                    <strong>Deliverable:</strong> {sprint.proofOfWorkProject.deliverable}
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {sprint.proofOfWorkProject.techStack.map((tech: string, tIdx: number) => (
                      <span 
                        key={tIdx}
                        className="text-[10px] font-mono bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Curated Study Resources */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              Curated Open-Source Learning Resources
            </h3>
            <span className="text-[11px] text-slate-400">
              Official docs & community gold standards
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activePlan.curatedResources.map((res: CuratedStudyResource, idx: number) => (
              <a
                key={idx}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-white/[0.05] hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors flex items-start justify-between group"
              >
                <div className="space-y-1 pr-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase text-indigo-600 dark:text-indigo-400 font-bold">
                      [{res.type}]
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {res.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {res.note}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0 mt-0.5" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
