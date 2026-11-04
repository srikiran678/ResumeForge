import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Download, 
  Upload, 
  Plus, 
  Check, 
  FolderGit2, 
  GraduationCap, 
  Briefcase, 
  Cpu, 
  Trophy, 
  Camera,
  ShieldCheck,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { PersonalInfoSection } from '../components/profile/PersonalInfoSection';
import { EducationSection } from '../components/profile/EducationSection';
import { ExperienceSection } from '../components/profile/ExperienceSection';
import { ProjectsSection } from '../components/profile/ProjectsSection';
import { SkillsSection } from '../components/profile/SkillsSection';
import { OtherSections } from '../components/profile/OtherSections';
import { CreateResumeModal } from '../components/profile/CreateResumeModal';
import { ResumeImportModal } from '../components/profile/ResumeImportModal';
import { ResumePhotoUploadModal } from '../components/profile/ResumePhotoUploadModal';
import { StepByStepProfileWizard } from '../components/profile/StepByStepProfileWizard';

export const MasterProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { masterProfile, updateMasterProfile, createResume } = useWorkspace();
  const [activeTab, setActiveTab] = useState<'personal' | 'education' | 'experience' | 'projects' | 'skills' | 'other'>('personal');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [wizardModalOpen, setWizardModalOpen] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);

  // Profile calculations
  const totalSkills = useMemo(() => {
    return Object.values(masterProfile.skills).reduce((acc, curr) => acc + curr.length, 0);
  }, [masterProfile.skills]);

  const otherCount = useMemo(() => {
    return masterProfile.hackathons.length +
      masterProfile.certifications.length +
      masterProfile.achievements.length;
  }, [masterProfile]);

  // Profile Completeness Score (0-100%)
  const { completenessScore, missingSteps } = useMemo(() => {
    let score = 0;
    const missing: string[] = [];

    // 1. Personal info (20%)
    const { fullName, email, phone, location } = masterProfile.personalInfo;
    if (fullName && email) {
      score += 15;
      if (phone && location) score += 5;
    } else {
      missing.push('Add full name & email');
    }

    // 2. Education (20%)
    if (masterProfile.education.length > 0) {
      score += 20;
    } else {
      missing.push('Add your degree / education');
    }

    // 3. Work or Projects (25%)
    if (masterProfile.experience.length > 0) {
      score += 15;
    }
    if (masterProfile.projects.length > 0) {
      score += masterProfile.experience.length > 0 ? 10 : 25;
    }
    if (masterProfile.experience.length === 0 && masterProfile.projects.length === 0) {
      missing.push('Add at least 1 project or work experience');
    }

    // 4. Skills (20%)
    if (totalSkills >= 5) {
      score += 20;
    } else if (totalSkills > 0) {
      score += 10;
      missing.push('Add 5+ skills across languages and frameworks');
    } else {
      missing.push('Add technical skills');
    }

    // 5. Links & Summary (15%)
    const { github, linkedIn, website, summary } = masterProfile.personalInfo;
    let bonus = 0;
    if (github || linkedIn || website) bonus += 8;
    if (summary && summary.trim().length > 20) bonus += 7;
    score += bonus;
    if (bonus < 15) {
      missing.push('Add GitHub / LinkedIn links or summary');
    }

    return {
      completenessScore: Math.min(100, score),
      missingSteps: missing,
    };
  }, [masterProfile, totalSkills]);

  // Candidate Initials
  const initials = useMemo(() => {
    const name = masterProfile.personalInfo.fullName.trim();
    if (!name) return 'RF';
    const parts = name.split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [masterProfile.personalInfo.fullName]);

  const handleExportProfile = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(masterProfile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `resumeforge_master_profile_${masterProfile.personalInfo.fullName.toLowerCase().replace(/\s+/g, '_') || 'candidate'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left space-y-7 transition-colors duration-150">
      {/* 1. Hero Candidate Header Card */}
      <div className="relative overflow-hidden bg-white/90 dark:bg-[#121316]/90 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-white/[0.08] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]">
        {/* Iridescent Top Glow Line */}
        <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-indigo-500/40 dark:via-indigo-400/50 to-transparent" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          {/* Left: Avatar & Candidate Info */}
          <div className="flex items-start sm:items-center space-x-4 sm:space-x-5">
            <div className="size-16 sm:size-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-500 text-white font-extrabold text-xl sm:text-2xl shadow-md flex items-center justify-center shrink-0 ring-4 ring-white dark:ring-[#16171c]">
              {initials}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                  {masterProfile.personalInfo.fullName || 'Candidate Profile'}
                </h1>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
                  <ShieldCheck className="size-3 text-emerald-500" />
                  <span>Truth Source Active</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
                {masterProfile.personalInfo.label || 'Target Role / Professional Headline'}
              </p>

              {/* Contact Meta Chips */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500 dark:text-slate-400">
                {masterProfile.personalInfo.email && (
                  <span className="inline-flex items-center space-x-1">
                    <Mail className="size-3 text-slate-400" />
                    <span>{masterProfile.personalInfo.email}</span>
                  </span>
                )}
                {masterProfile.personalInfo.phone && (
                  <span className="inline-flex items-center space-x-1">
                    <Phone className="size-3 text-slate-400" />
                    <span>{masterProfile.personalInfo.phone}</span>
                  </span>
                )}
                {masterProfile.personalInfo.location && (
                  <span className="inline-flex items-center space-x-1">
                    <MapPin className="size-3 text-slate-400" />
                    <span>{masterProfile.personalInfo.location}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Primary Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={() => setWizardModalOpen(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#16171c] hover:bg-slate-50 dark:hover:bg-[#1a1b22] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] font-bold text-xs shadow-2xs transition-all cursor-pointer"
              title="Guided step-by-step setup"
            >
              <User className="size-3.5 text-indigo-500" />
              <span>Guided Setup</span>
            </button>

            <button
              onClick={() => setPhotoModalOpen(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 font-bold text-xs shadow-2xs transition-all cursor-pointer"
              title="Scan existing physical resume via OCR"
            >
              <Camera className="size-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Upload Photo</span>
            </button>

            <button
              onClick={() => setImportModalOpen(true)}
              className="inline-flex items-center justify-center space-x-1 px-3 py-2.5 rounded-xl bg-white dark:bg-[#16171c] hover:bg-slate-50 dark:hover:bg-[#1a1b22] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08] font-semibold text-xs transition-colors cursor-pointer"
              title="Import Master Profile JSON"
            >
              <Upload className="size-3.5" />
              <span>Import</span>
            </button>

            <button
              onClick={handleExportProfile}
              className="inline-flex items-center justify-center space-x-1 px-3 py-2.5 rounded-xl bg-white dark:bg-[#16171c] hover:bg-slate-50 dark:hover:bg-[#1a1b22] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08] font-semibold text-xs transition-colors cursor-pointer"
              title="Export Master Profile JSON"
            >
              <Download className="size-3.5" />
              <span>Export</span>
            </button>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Create Resume from Profile</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Pill Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-5 mt-5 border-t border-slate-100 dark:border-white/[0.06]">
          <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-[#16171c] border border-slate-200/60 dark:border-white/[0.04] text-center">
            <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">Education</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
              {masterProfile.education.length}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-[#16171c] border border-slate-200/60 dark:border-white/[0.04] text-center">
            <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">Experience</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
              {masterProfile.experience.length}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-[#16171c] border border-slate-200/60 dark:border-white/[0.04] text-center">
            <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">Projects</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
              {masterProfile.projects.length}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-[#16171c] border border-slate-200/60 dark:border-white/[0.04] text-center">
            <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">Skills</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
              {totalSkills}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-slate-50/70 dark:bg-[#16171c] border border-slate-200/60 dark:border-white/[0.04] text-center">
            <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">Honors & More</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
              {otherCount}
            </span>
          </div>
        </div>
      </div>

      {/* Export Toast Notice */}
      {exportNotice && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center space-x-2 animate-fade-in shadow-xs">
          <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
          <span>Master Profile exported successfully as JSON!</span>
        </div>
      )}

      {/* 2. Profile Completeness & ATS Readiness Card */}
      <div className="bg-white/80 dark:bg-[#121316]/80 backdrop-blur-md border border-slate-200/80 dark:border-white/[0.08] rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2.5">
          <div className="flex items-center space-x-2.5">
            <div className="size-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="size-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Profile Strength Index</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                  completenessScore >= 85 
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                }`}>
                  {completenessScore >= 85 ? 'ATS Top Tier' : 'Needs Polish'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Measures depth and evidence across all ATS parsing categories.
              </p>
            </div>
          </div>

          <span className="text-lg font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {completenessScore}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${completenessScore}%` }}
          />
        </div>

        {/* Missing tips */}
        {missingSteps.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Quick suggestions:</span>
            {missingSteps.map((step, idx) => (
              <span key={idx} className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#16171c] text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-white/[0.04]">
                <AlertCircle className="size-3 text-amber-500" />
                <span>{step}</span>
              </span>
            ))}
          </div>
        ) : (
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Check className="size-4" />
            <span>Profile is 100% complete and ready for instant ATS resume tailoring!</span>
          </div>
        )}
      </div>

      {/* 3. Sticky Segmented Navigation Tabs */}
      <div className="sticky top-16 z-20 bg-slate-50/90 dark:bg-[#0b0e14]/90 backdrop-blur-md py-1">
        <div className="flex bg-slate-100/90 dark:bg-[#121316] p-1.5 rounded-2xl border border-slate-200/90 dark:border-white/[0.08] overflow-x-auto space-x-1.5 scrollbar-none shadow-xs">
          {[
            { key: 'personal', label: 'Personal Info', icon: User, count: 1 },
            { key: 'education', label: 'Education', icon: GraduationCap, count: masterProfile.education.length },
            { key: 'experience', label: 'Experience', icon: Briefcase, count: masterProfile.experience.length },
            { key: 'projects', label: 'Projects', icon: FolderGit2, count: masterProfile.projects.length },
            { key: 'skills', label: 'Technical Skills', icon: Cpu, count: totalSkills },
            { key: 'other', label: 'Hackathons & More', icon: Trophy, count: otherCount },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-[#1a1b22] text-slate-900 dark:text-white shadow-xs border border-slate-200/80 dark:border-white/[0.08]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-white/[0.02]'
                }`}
              >
                <Icon className={`size-3.5 ${isActive ? 'text-indigo-500' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full tabular-nums ${
                    isActive 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100' 
                      : 'bg-slate-200/60 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Two-Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Main Section Canvas (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {activeTab === 'personal' && (
            <PersonalInfoSection
              personalInfo={masterProfile.personalInfo}
              onChange={(personalInfo) => updateMasterProfile({ ...masterProfile, personalInfo })}
            />
          )}

          {activeTab === 'education' && (
            <EducationSection
              education={masterProfile.education}
              onChange={(education) => updateMasterProfile({ ...masterProfile, education })}
            />
          )}

          {activeTab === 'experience' && (
            <ExperienceSection
              experience={masterProfile.experience}
              onChange={(experience) => updateMasterProfile({ ...masterProfile, experience })}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsSection
              projects={masterProfile.projects}
              onChange={(projects) => updateMasterProfile({ ...masterProfile, projects })}
            />
          )}

          {activeTab === 'skills' && (
            <SkillsSection
              skills={masterProfile.skills}
              onChange={(skills) => updateMasterProfile({ ...masterProfile, skills })}
            />
          )}

          {activeTab === 'other' && (
            <OtherSections
              certifications={masterProfile.certifications}
              achievements={masterProfile.achievements}
              hackathons={masterProfile.hackathons}
              volunteering={masterProfile.volunteering}
              openSource={masterProfile.openSource}
              publications={masterProfile.publications}
              onChange={(updates) => updateMasterProfile({ ...masterProfile, ...updates })}
            />
          )}
        </div>

        {/* Right Telemetry & Actions Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card A: ATS Health Check */}
          <div className="bg-white dark:bg-[#121316] border border-slate-200/90 dark:border-white/[0.08] rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center space-x-2">
              <FileCheck2 className="size-4 text-emerald-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                ATS Compatibility Checklist
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 dark:bg-[#16171c] border border-slate-100 dark:border-white/[0.04]">
                <span className="text-slate-700 dark:text-slate-300">Single-Column Hierarchy</span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Enforced
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 dark:bg-[#16171c] border border-slate-100 dark:border-white/[0.04]">
                <span className="text-slate-700 dark:text-slate-300">Contact Details</span>
                {masterProfile.personalInfo.email && masterProfile.personalInfo.phone ? (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Complete
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                    Missing Info
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 dark:bg-[#16171c] border border-slate-100 dark:border-white/[0.04]">
                <span className="text-slate-700 dark:text-slate-300">Verified Skills</span>
                {totalSkills >= 5 ? (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 font-mono tabular-nums">
                    {totalSkills} Skills
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                    Add 5+
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 dark:bg-[#16171c] border border-slate-100 dark:border-white/[0.04]">
                <span className="text-slate-700 dark:text-slate-300">Action Verbs & Impact</span>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                  XYZ Ready
                </span>
              </div>
            </div>
          </div>

          {/* Card B: Fast Career Suite Bridges */}
          <div className="bg-white dark:bg-[#121316] border border-slate-200/90 dark:border-white/[0.08] rounded-3xl p-5 shadow-xs space-y-3.5">
            <div className="flex items-center space-x-2">
              <Sparkles className="size-4 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Career Suite Acceleration
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Launch specialized career tools using your verified Master Profile data.
            </p>

            <div className="space-y-2">
              <Link
                to="/job-match"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 dark:bg-[#16171c] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/70 dark:border-white/[0.06] text-slate-800 dark:text-slate-200 text-xs font-bold transition-all group"
              >
                <span>🎯 Test Fit Against Target Job</span>
                <ArrowRight className="size-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-indigo-500 transition-all" />
              </Link>

              <Link
                to="/cover-letters"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 dark:bg-[#16171c] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/70 dark:border-white/[0.06] text-slate-800 dark:text-slate-200 text-xs font-bold transition-all group"
              >
                <span>✍️ Draft 1-Page Cover Letter</span>
                <ArrowRight className="size-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-indigo-500 transition-all" />
              </Link>

              <Link
                to="/interview-prep"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 dark:bg-[#16171c] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/70 dark:border-white/[0.06] text-slate-800 dark:text-slate-200 text-xs font-bold transition-all group"
              >
                <span>🎙️ Practice STAR Interview</span>
                <ArrowRight className="size-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-indigo-500 transition-all" />
              </Link>

              <Link
                to="/upskilling"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 dark:bg-[#16171c] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/70 dark:border-white/[0.06] text-slate-800 dark:text-slate-200 text-xs font-bold transition-all group"
              >
                <span>🚀 Skill Gap & 4-Week Roadmap</span>
                <ArrowRight className="size-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-indigo-500 transition-all" />
              </Link>
            </div>
          </div>

          {/* Card C: Truth Wins Philosophy */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 space-y-1.5 text-left">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-300">
              <ShieldCheck className="size-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Zero-Hallucination Guardrail</span>
            </div>
            <p className="text-[11px] text-indigo-800/80 dark:text-indigo-300/80 leading-relaxed">
              When ResumeForge tailors resumes, every skill, metric, and bullet point maps directly to records stored here. Truth wins.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateResumeModal
        isOpen={createModalOpen}
        onCreate={(title, targetRole, targetCompany, template) => {
          const newResume = createResume(title, targetRole, targetCompany, template);
          navigate(`/editor/${newResume.id}`);
        }}
        onClose={() => setCreateModalOpen(false)}
      />

      <ResumeImportModal
        isOpen={importModalOpen}
        masterProfile={masterProfile}
        onSaveToProfile={(updated) => updateMasterProfile(updated)}
        onClose={() => setImportModalOpen(false)}
      />

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

      <ResumePhotoUploadModal
        isOpen={photoModalOpen}
        masterProfile={masterProfile}
        onSaveToProfile={(updated) => {
          updateMasterProfile(updated);
          setPhotoModalOpen(false);
        }}
        onClose={() => setPhotoModalOpen(false)}
      />
    </div>
  );
};
