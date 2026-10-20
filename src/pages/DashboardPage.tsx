import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Briefcase, 
  Sparkles, 
  Plus, 
  Calendar, 
  Clock, 
  ArrowRight,
  FileCheck,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWorkspace } from '../context/WorkspaceContext';
import { CreateResumeModal } from '../components/profile/CreateResumeModal';
import { ATSAnalyzer } from '../lib/atsAnalyzer';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { resumes, applications, aiUsage, createResume } = useWorkspace();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Counts
  const activeResumes = resumes.filter((r) => !r.isTrash);
  const activeApplications = applications;
  const interviewCount = applications.filter((a) => a.status === 'Interview').length;
  const offerCount = applications.filter((a) => a.status === 'Offer').length;

  // Upcoming deadlines
  const upcomingDeadlines = applications
    .filter((a) => a.deadline && ['Interested', 'Preparing'].includes(a.status))
    .sort((a, b) => (a.deadline! > b.deadline! ? 1 : -1))
    .slice(0, 3);

  // Greeting
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left space-y-8 transition-colors duration-150">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#0c101b] p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 shadow-card-subtle">
        <div>
          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Career Workspace</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight mt-0.5">
            {greeting}{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            "Write once. Adapt honestly. Apply everywhere."
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-xs shadow-xs hover:shadow-indigo-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Resume</span>
          </button>
        </div>
      </div>

      {/* Recommended 4 Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Resumes */}
        <Link
          to="/resumes"
          className="bg-white dark:bg-[#0c101b] p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 shadow-card-subtle hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all space-y-1.5 group"
        >
          <div className="flex justify-between items-center text-slate-400 dark:text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">My Resumes</span>
            <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-indigo-500 transition-colors" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">{activeResumes.length}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">100% single-column ATS safe</div>
        </Link>

        {/* Applications */}
        <Link
          to="/applications"
          className="bg-white dark:bg-[#0c101b] p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 shadow-card-subtle hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all space-y-1.5 group"
        >
          <div className="flex justify-between items-center text-slate-400 dark:text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Applications</span>
            <Briefcase className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-indigo-500 transition-colors" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">{activeApplications.length}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Tracked with immutable snapshots</div>
        </Link>

        {/* Interviews */}
        <Link
          to="/applications"
          className="bg-white dark:bg-[#0c101b] p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 shadow-card-subtle hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all space-y-1.5 group"
        >
          <div className="flex justify-between items-center text-slate-400 dark:text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Interviews</span>
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform" />
          </div>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight tabular-nums">{interviewCount}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Technical rounds scheduled</div>
        </Link>

        {/* Offers */}
        <Link
          to="/applications"
          className="bg-white dark:bg-[#0c101b] p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 shadow-card-subtle hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all space-y-1.5 group"
        >
          <div className="flex justify-between items-center text-slate-400 dark:text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Offers</span>
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform" />
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight tabular-nums">{offerCount}</div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Verified outcomes</div>
        </Link>
      </div>

      {/* Primary Quick Actions Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 dark:from-[#0c101b] dark:via-slate-900 dark:to-indigo-950/70 border border-slate-800/80 text-white rounded-2xl p-6 shadow-md">
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Quick Actions</h2>
          <p className="text-xs text-slate-400 mt-0.5">Jump right into your career workflow</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Action 1: Create Resume */}
          <button
            onClick={() => setCreateModalOpen(true)}
            className="p-4 bg-slate-800/80 dark:bg-slate-850 hover:bg-slate-750 dark:hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left transition-all group flex items-start space-x-3.5 hover:border-indigo-500/50"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30 group-hover:scale-105 transition-all">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Create Resume</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Single-column ATS format</div>
            </div>
          </button>

          {/* Action 2: Analyze Resume */}
          <Link
            to={resumes[0] ? `/analyzer/${resumes[0].id}` : '/resumes'}
            className="p-4 bg-slate-800/80 dark:bg-slate-850 hover:bg-slate-750 dark:hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left transition-all group flex items-start space-x-3.5 hover:border-indigo-500/50"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 group-hover:bg-amber-500/30 group-hover:scale-105 transition-all">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">ATS Compatibility Check</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Score & Notepad Test</div>
            </div>
          </Link>

          {/* Action 3: Track Application */}
          <Link
            to="/applications"
            className="p-4 bg-slate-800/80 dark:bg-slate-850 hover:bg-slate-750 dark:hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left transition-all group flex items-start space-x-3.5 hover:border-indigo-500/50"
          >
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30 group-hover:scale-105 transition-all">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Track Application</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Kanban & Snapshots</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Dashboard Grid: My Resumes + Recent Applications + Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: My Resumes (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">My Resumes</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tailored single-column ATS-compliant resumes</p>
            </div>
            <Link
              to="/resumes"
              className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center space-x-1"
            >
              <span>View all (<span className="tabular-nums">{activeResumes.length}</span>)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {activeResumes.length === 0 ? (
              <div className="bg-white dark:bg-[#0c101b] p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
                <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center mx-auto">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white text-balance">No resumes created yet</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto text-pretty">
                    Create single-column ATS-compliant resumes tailored for specific jobs with real-time formatting and deterministic ATS checks.
                  </p>
                </div>
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold bg-slate-950 hover:bg-slate-850 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Your First Resume</span>
                </button>
              </div>
            ) : (
              activeResumes.slice(0, 3).map((resume) => {
                const atsResult = ATSAnalyzer.analyze(resume);

                return (
                  <div
                    key={resume.id}
                    className="bg-white dark:bg-[#0c101b] p-4 rounded-xl border border-slate-200/90 dark:border-slate-800/80 shadow-card-subtle hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{resume.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-semibold">
                          v{resume.meta.version}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded font-bold">
                          {resume.meta.template}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Target: {resume.targetRole || 'Generalist'} {resume.targetCompany ? `• ${resume.targetCompany}` : ''}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-auto">
                      {/* ATS Mini Score */}
                      <div className="text-right">
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {atsResult.overallScore}% ATS Score
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">Deterministic check</div>
                      </div>

                      <Link
                        to={`/editor/${resume.id}`}
                        className="px-3.5 py-1.5 text-xs font-semibold bg-slate-950 hover:bg-slate-850 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-lg shadow-xs transition-colors"
                      >
                        Open Editor
                      </Link>

                      <Link
                        to={`/analyzer/${resume.id}`}
                        className="px-2.5 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg transition-colors"
                        title="Run ATS Check"
                      >
                        Analyze
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Recent Applications List */}
          <div className="pt-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Applications</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Real-time status and preserved submission snapshots</p>
              </div>
              <Link
                to="/applications"
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center space-x-1"
              >
                <span>All applications →</span>
              </Link>
            </div>

            {activeApplications.length === 0 ? (
              <div className="bg-white dark:bg-[#0c101b] p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 text-center space-y-2">
                <Briefcase className="w-6 h-6 text-slate-400 dark:text-slate-500 mx-auto" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No applications tracked yet</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Track your interview pipelines and save automatic resume snapshots.</p>
                <Link
                  to="/applications"
                  className="inline-block mt-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 underline"
                >
                  Go to Application Tracker →
                </Link>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#0c101b] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 shadow-card-subtle divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
                {activeApplications.slice(0, 4).map((app) => (
                  <div key={app.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{app.company}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">— {app.role}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">
                        Applied: {app.applicationDate || 'Not yet submitted'} {app.location ? `• ${app.location}` : ''}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          app.status === 'Offer'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : app.status === 'Interview'
                            ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                            : app.status === 'Applied'
                            ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {app.status}
                      </span>
                      <Link
                        to={`/applications/${app.id}`}
                        className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1"
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Upcoming Deadlines & AI Daily Quota */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <div className="bg-white dark:bg-[#0c101b] p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 shadow-card-subtle space-y-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Upcoming Deadlines</h3>
            </div>

            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 py-3">No upcoming deadlines flagged.</p>
            ) : (
              <div className="space-y-2">
                {upcomingDeadlines.map((app) => (
                  <div key={app.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>{app.company}</span>
                      <span className="text-amber-600 dark:text-amber-400 font-mono">{app.deadline}</span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px]">{app.role}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Usage Card */}
          <div className="bg-white dark:bg-[#0c101b] p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 shadow-card-subtle space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Honest AI Usage</h3>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                {Math.max(0, aiUsage.maxDailyCalls - aiUsage.callsUsedToday)} / {aiUsage.maxDailyCalls} left
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Enforced server-side quota (20 calls/day). AI suggests action verbs and evaluates job gaps without inventing unverified facts.
            </p>

            <Link
              to="/ai"
              className="block text-center py-2 px-3 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Open Job Matcher & AI Tools →
            </Link>
          </div>
        </div>
      </div>

      {/* Create Resume Modal */}
      <CreateResumeModal
        isOpen={createModalOpen}
        onCreate={(title, targetRole, targetCompany, template) => {
          const newResume = createResume(title, targetRole, targetCompany, template);
          navigate(`/editor/${newResume.id}`);
        }}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
};
