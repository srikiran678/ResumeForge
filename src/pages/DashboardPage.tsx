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
  Award,
  Camera,
  Layout,
  User,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWorkspace } from '../context/WorkspaceContext';
import { CreateResumeModal } from '../components/profile/CreateResumeModal';
import { ResumePhotoUploadModal } from '../components/profile/ResumePhotoUploadModal';
import { StepByStepProfileWizard } from '../components/profile/StepByStepProfileWizard';
import { TemplateGalleryModal } from '../components/resume/TemplateGalleryModal';
import { TemplateId } from '../types';
import { ATSAnalyzer } from '../lib/atsAnalyzer';

const getInitialGreeting = (): string => {
  const currentHour = new Date().getHours();
  return currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { resumes, applications, aiUsage, createResume, masterProfile, updateMasterProfile } = useWorkspace();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [wizardModalOpen, setWizardModalOpen] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [selectedGalleryTemplate, setSelectedGalleryTemplate] = useState<TemplateId>('modern');

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
  const [greeting] = useState(getInitialGreeting);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left space-y-8 transition-colors duration-150">
      {/* Top Banner / Welcome - Modern Builder Tool styling */}
      <div className="relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/90 dark:bg-[#121316]/90 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-white/[0.08] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]">
        {/* Subtle iridescent top highlight */}
        <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-indigo-500/40 dark:via-indigo-400/50 to-transparent" />

        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-mono font-semibold">
            <span className="size-1.5 rounded-full bg-indigo-500" />
            <span>Workspace Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight font-display text-balance">
            {greeting}{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium text-pretty">
            Build once. Adapt honestly. Apply everywhere with verified single-column ATS layouts.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto relative z-10">
          <button
            onClick={() => setWizardModalOpen(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-[#16171c] hover:bg-slate-50 dark:hover:bg-[#1a1b22] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] font-bold text-xs shadow-2xs transition-all cursor-pointer"
            title="Guided step-by-step profile builder"
          >
            <User className="w-3.5 h-3.5 text-indigo-500" />
            <span>Step-by-Step Setup</span>
          </button>

          <button
            onClick={() => setPhotoModalOpen(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 font-bold text-xs shadow-2xs transition-all cursor-pointer"
            title="Upload photo of resume for OCR scanning"
          >
            <Camera className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Upload Photo</span>
          </button>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Resume</span>
          </button>
        </div>
      </div>

      {/* 3-Way Guided Fast Track Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50/70 via-white to-slate-50/80 dark:from-indigo-950/20 dark:via-[#121316] dark:to-[#16171c] p-6 rounded-3xl border border-indigo-100/80 dark:border-white/[0.08] shadow-xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100/70 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Smart Onboarding</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white font-display">
              Build Your Default Career Profile
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Fill your details once to save them by default. When you ask the AI to generate or tailor resumes, it pulls automatically from your verified default profile.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to="/templates"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Company Templates</span>
            </Link>
            <button
              onClick={() => setGalleryModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-[#16171c] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1a1b22] transition-colors cursor-pointer"
            >
              <Layout className="w-3.5 h-3.5 text-indigo-500" />
              <span>Explore Templates</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Upload Photo / Scan */}
          <div 
            onClick={() => setPhotoModalOpen(true)}
            className="p-4 rounded-2xl bg-white dark:bg-[#16171c] border border-slate-200/80 dark:border-white/[0.08] hover:border-indigo-300 dark:hover:border-indigo-700/60 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
          >
            <div className="flex items-center space-x-3">
              <div className="size-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-950 dark:text-white block">
                  Upload Photo of Resume
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  Fastest Setup
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Have a paper or PDF sample resume? Take a photo or upload it. Our OCR parser extracts your contact info, skills, and experience into your default profile.
            </p>
            <div className="flex items-center space-x-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 pt-1">
              <span>Scan Photo</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Fill Details Step-by-Step */}
          <div 
            onClick={() => setWizardModalOpen(true)}
            className="p-4 rounded-2xl bg-white dark:bg-[#16171c] border border-slate-200/80 dark:border-white/[0.08] hover:border-indigo-300 dark:hover:border-indigo-700/60 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
          >
            <div className="flex items-center space-x-3">
              <div className="size-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-950 dark:text-white block">
                  Fill Details One by One
                </span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                  Guided Wizard
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Step through our 6 guided forms to enter your education, roles, projects, and skills with quick chips, then save as your default AI baseline.
            </p>
            <div className="flex items-center space-x-1 text-xs font-bold text-purple-600 dark:text-purple-400 pt-1">
              <span>Start Wizard</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: 10 ATS Templates */}
          <div 
            onClick={() => setGalleryModalOpen(true)}
            className="p-4 rounded-2xl bg-white dark:bg-[#16171c] border border-slate-200/80 dark:border-white/[0.08] hover:border-indigo-300 dark:hover:border-indigo-700/60 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
          >
            <div className="flex items-center space-x-3">
              <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Layout className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-950 dark:text-white block">
                  10+ ATS Templates
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  Industry Tested
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Browse top formats: Silicon Valley minimalist, Wall Street executive, Academic research, Modern tech, and dense 1-page builders.
            </p>
            <div className="flex items-center space-x-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-1">
              <span>View Templates</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Recommended 4 Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Resumes */}
        <Link
          to="/resumes"
          className="bg-white/90 dark:bg-[#121316] p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xs hover:shadow-sm hover:border-slate-300 dark:hover:border-white/[0.15] transition-all space-y-1.5 group cursor-pointer"
        >
          <div className="flex justify-between items-center text-slate-400 dark:text-slate-500">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">My Resumes</span>
            <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          </div>
          <div className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight tabular-nums font-display">{activeResumes.length}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">100% single-column ATS safe</div>
        </Link>

        {/* Applications */}
        <Link
          to="/applications"
          className="bg-white/90 dark:bg-[#121316] p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xs hover:shadow-sm hover:border-slate-300 dark:hover:border-white/[0.15] transition-all space-y-1.5 group cursor-pointer"
        >
          <div className="flex justify-between items-center text-slate-400 dark:text-slate-500">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Applications</span>
            <Briefcase className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          </div>
          <div className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight tabular-nums font-display">{activeApplications.length}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Tracked with snapshots</div>
        </Link>

        {/* Interviews */}
        <Link
          to="/applications"
          className="bg-white/90 dark:bg-[#121316] p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xs hover:shadow-sm hover:border-slate-300 dark:hover:border-white/[0.15] transition-all space-y-1.5 group cursor-pointer"
        >
          <div className="flex justify-between items-center text-slate-400 dark:text-slate-500">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Interviews</span>
            <Calendar className="w-4 h-4 text-blue-500 group-hover:scale-105 transition-transform" />
          </div>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight tabular-nums font-display">{interviewCount}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Technical rounds</div>
        </Link>

        {/* Offers */}
        <Link
          to="/applications"
          className="bg-white/90 dark:bg-[#121316] p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xs hover:shadow-sm hover:border-slate-300 dark:hover:border-white/[0.15] transition-all space-y-1.5 group cursor-pointer"
        >
          <div className="flex justify-between items-center text-slate-400 dark:text-slate-500">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Offers</span>
            <Award className="w-4 h-4 text-emerald-500 group-hover:scale-105 transition-transform" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight tabular-nums font-display">{offerCount}</div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Verified outcomes</div>
        </Link>
      </div>

      {/* Primary Quick Actions Bar */}
      <div className="relative overflow-hidden bg-white/90 dark:bg-[#121316] border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-6 shadow-xs text-left">
        <div className="mb-4">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Command Shortcuts</h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">Jump right into your career workflow</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Action 1: Create Resume */}
          <button
            onClick={() => setCreateModalOpen(true)}
            className="p-4 bg-slate-50/70 dark:bg-[#18191f] hover:bg-slate-100 dark:hover:bg-[#202128] border border-slate-200/70 dark:border-white/[0.06] rounded-2xl text-left transition-all group flex items-start space-x-3.5 hover:border-slate-300 dark:hover:border-white/[0.12] cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500/20 group-hover:scale-105 transition-all">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Create Resume</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Single-column ATS format</div>
            </div>
          </button>

          {/* Action 2: Analyze Resume */}
          <Link
            to={resumes[0] ? `/analyzer/${resumes[0].id}` : '/resumes'}
            className="p-4 bg-slate-50/70 dark:bg-[#18191f] hover:bg-slate-100 dark:hover:bg-[#202128] border border-slate-200/70 dark:border-white/[0.06] rounded-2xl text-left transition-all group flex items-start space-x-3.5 hover:border-slate-300 dark:hover:border-white/[0.12] cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500/20 group-hover:scale-105 transition-all">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">ATS Compatibility Check</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Score & Notepad Test</div>
            </div>
          </Link>

          {/* Action 3: Track Application */}
          <Link
            to="/applications"
            className="p-4 bg-slate-50/70 dark:bg-[#18191f] hover:bg-slate-100 dark:hover:bg-[#202128] border border-slate-200/70 dark:border-white/[0.06] rounded-2xl text-left transition-all group flex items-start space-x-3.5 hover:border-slate-300 dark:hover:border-white/[0.12] cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-500/20 group-hover:scale-105 transition-all">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Track Application</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Kanban & Snapshots</div>
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
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">My Resumes</h2>
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
              <div className="bg-white dark:bg-[#121316] p-8 rounded-3xl border border-dashed border-slate-200 dark:border-white/[0.08] text-center space-y-3">
                <div className="size-11 rounded-2xl bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400 flex items-center justify-center mx-auto">
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
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold bg-slate-950 hover:bg-slate-850 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 rounded-xl transition-colors shadow-xs cursor-pointer"
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
                    className="bg-white/90 dark:bg-[#121316] p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.07] shadow-2xs hover:border-slate-300 dark:hover:border-white/[0.15] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white font-display">{resume.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 rounded font-semibold border border-transparent dark:border-white/[0.08]">
                          v{resume.meta.version}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/60 rounded font-bold">
                          {resume.meta.template}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Target: {resume.targetRole || 'Generalist'} {resume.targetCompany ? `• ${resume.targetCompany}` : ''}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5 self-end sm:self-auto">
                      {/* ATS Mini Score */}
                      <div className="text-right">
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                          <span className="tabular-nums">{atsResult.overallScore}</span>% ATS
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">Deterministic</div>
                      </div>

                      <Link
                        to={`/editor/${resume.id}`}
                        className="px-3 py-1.5 text-xs font-semibold bg-slate-950 hover:bg-slate-850 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 rounded-lg shadow-2xs transition-colors cursor-pointer"
                      >
                        Open Editor
                      </Link>

                      <Link
                        to={`/analyzer/${resume.id}`}
                        className="px-2.5 py-1.5 text-xs font-medium bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-800 dark:text-slate-200 rounded-lg transition-colors cursor-pointer border border-transparent dark:border-white/[0.06]"
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
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">Recent Applications</h2>
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
              <div className="bg-white dark:bg-[#121316] p-6 rounded-2xl border border-slate-200/80 dark:border-white/[0.07] text-center space-y-2">
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
              <div className="bg-white/90 dark:bg-[#121316] rounded-2xl border border-slate-200/80 dark:border-white/[0.07] shadow-2xs divide-y divide-slate-100 dark:divide-white/[0.05] overflow-hidden">
                {activeApplications.slice(0, 4).map((app) => (
                  <div key={app.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-white/[0.03] transition-colors">
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
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          app.status === 'Offer'
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : app.status === 'Interview'
                            ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                            : app.status === 'Applied'
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                            : 'bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300'
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
          <div className="bg-white/90 dark:bg-[#121316] p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.07] shadow-2xs space-y-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">Upcoming Deadlines</h3>
            </div>

            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 py-3">No upcoming deadlines flagged.</p>
            ) : (
              <div className="space-y-2">
                {upcomingDeadlines.map((app) => (
                  <div key={app.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.05] text-xs">
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>{app.company}</span>
                      <span className="text-amber-600 dark:text-amber-400 font-mono tabular-nums">{app.deadline}</span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px]">{app.role}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Usage Card */}
          <div className="bg-white/90 dark:bg-[#121316] p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.07] shadow-2xs space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">Honest AI Usage</h3>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                {Math.max(0, aiUsage.maxDailyCalls - aiUsage.callsUsedToday)}/{aiUsage.maxDailyCalls} left
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-pretty">
              Enforced server-side quota (20 calls/day). AI suggests action verbs and evaluates job gaps without inventing unverified facts.
            </p>

            <Link
              to="/ai"
              className="block text-center py-2 px-3 text-xs font-semibold bg-slate-100 dark:bg-white/[0.06] text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/[0.09] rounded-xl transition-colors cursor-pointer border border-transparent dark:border-white/[0.06]"
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

      {/* Guided Step-by-Step Profile Wizard */}
      <StepByStepProfileWizard
        isOpen={wizardModalOpen}
        onClose={() => setWizardModalOpen(false)}
        onCompleted={(newResumeId) => {
          setWizardModalOpen(false);
          if (newResumeId) {
            navigate(`/editor/${newResumeId}`);
          }
        }}
      />

      {/* Resume Photo Upload / OCR Modal */}
      <ResumePhotoUploadModal
        isOpen={photoModalOpen}
        masterProfile={masterProfile}
        onSaveToProfile={(updated) => {
          updateMasterProfile(updated);
          setPhotoModalOpen(false);
          // Directly create or offer to generate resume
          const newResume = createResume(
            `${updated.personalInfo.fullName || 'Professional'} Resume`,
            updated.personalInfo.label || 'Software Engineer',
            '',
            'modern'
          );
          navigate(`/editor/${newResume.id}`);
        }}
        onClose={() => setPhotoModalOpen(false)}
      />

      {/* 10 Professional ATS Templates Gallery Modal */}
      <TemplateGalleryModal
        isOpen={galleryModalOpen}
        selectedTemplateId={selectedGalleryTemplate}
        onSelectTemplate={(templateId) => {
          setSelectedGalleryTemplate(templateId);
          setGalleryModalOpen(false);
          const newResume = createResume(
            `${masterProfile.personalInfo.fullName || 'Professional'} Resume`,
            masterProfile.personalInfo.label || 'Software Engineer',
            '',
            templateId
          );
          navigate(`/editor/${newResume.id}`);
        }}
        onClose={() => setGalleryModalOpen(false)}
      />
    </div>
  );
};
