import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Download, 
  Upload, 
  Plus, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  FolderGit2, 
  GraduationCap, 
  Briefcase, 
  Cpu, 
  Trophy, 
  Layers,
  Camera
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

  const handleExportProfile = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(masterProfile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `resumeforge_master_profile_${masterProfile.personalInfo.fullName.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-forge-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-forge-400 uppercase tracking-wider">Source of Truth</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Verified Items
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-forge-900 tracking-tight mt-1">
            Master Career Profile
          </h1>
          <p className="text-xs text-forge-500 mt-0.5">
            Write once. Every project, hackathon, and skill stored here with stable IDs for reliable resume generation.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setWizardModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold bg-white border border-forge-300 text-forge-700 hover:bg-forge-50 rounded-lg transition-colors shadow-sm cursor-pointer"
            title="Step-by-step guided profile setup"
          >
            <User className="w-3.5 h-3.5 text-indigo-500" />
            <span>Guided Setup</span>
          </button>

          <button
            onClick={() => setPhotoModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors shadow-sm cursor-pointer"
            title="Upload photo of resume for OCR scanning"
          >
            <Camera className="w-3.5 h-3.5 text-indigo-600" />
            <span>Upload Photo</span>
          </button>

          <button
            onClick={() => setImportModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold bg-white border border-forge-300 text-forge-700 hover:bg-forge-50 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON</span>
          </button>

          <button
            onClick={handleExportProfile}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold bg-white border border-forge-300 text-forge-700 hover:bg-forge-50 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold bg-forge-900 text-white hover:bg-forge-800 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Resume from Profile</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-800 flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Master Profile exported successfully as JSON!</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-forge-200 overflow-x-auto space-x-2 scrollbar-none pb-1">
        {[
          { key: 'personal', label: 'Personal Info', icon: User, count: 1 },
          { key: 'education', label: 'Education', icon: GraduationCap, count: masterProfile.education.length },
          { key: 'experience', label: 'Work Experience', icon: Briefcase, count: masterProfile.experience.length },
          { key: 'projects', label: 'Projects', icon: FolderGit2, count: masterProfile.projects.length },
          {
            key: 'skills',
            label: 'Skills',
            icon: Cpu,
            count: Object.values(masterProfile.skills).reduce((acc, curr) => acc + curr.length, 0),
          },
          {
            key: 'other',
            label: 'Hackathons & More',
            icon: Trophy,
            count:
              masterProfile.hackathons.length +
              masterProfile.certifications.length +
              masterProfile.achievements.length,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-forge-900 text-white shadow-sm'
                  : 'bg-white text-forge-600 border border-forge-200 hover:bg-forge-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-forge-800 text-white' : 'bg-forge-100 text-forge-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
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

      {/* Create Resume Modal */}
      <CreateResumeModal
        isOpen={createModalOpen}
        onCreate={(title, targetRole, targetCompany, template) => {
          const newResume = createResume(title, targetRole, targetCompany, template);
          navigate(`/editor/${newResume.id}`);
        }}
        onClose={() => setCreateModalOpen(false)}
      />

      {/* Import Resume Modal */}
      <ResumeImportModal
        isOpen={importModalOpen}
        masterProfile={masterProfile}
        onSaveToProfile={(updated) => updateMasterProfile(updated)}
        onClose={() => setImportModalOpen(false)}
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

      {/* Resume Photo Upload Modal */}
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
