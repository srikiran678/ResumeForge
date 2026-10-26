import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Copy, 
  Trash2, 
  RotateCcw, 
  Search, 
  FileCheck, 
  Camera, 
  Layout, 
  User 
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { ATSAnalyzer } from '@/modules/ats';
import { CreateResumeModal } from '../components/profile/CreateResumeModal';
import { ResumePhotoUploadModal } from '../components/profile/ResumePhotoUploadModal';
import { StepByStepProfileWizard } from '../components/profile/StepByStepProfileWizard';
import { TemplateGalleryModal } from '../components/resume/TemplateGalleryModal';
import { TemplateId } from '../types';

export const ResumesPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    resumes, 
    duplicateResume, 
    moveToTrash, 
    restoreFromTrash, 
    deletePermanently, 
    createResume,
    masterProfile,
    updateMasterProfile
  } = useWorkspace();

  const [filter, setFilter] = useState<'active' | 'archived' | 'trash'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [wizardModalOpen, setWizardModalOpen] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [selectedGalleryTemplate, setSelectedGalleryTemplate] = useState<TemplateId>('modern');

  const filteredResumes = resumes.filter((r) => {
    if (filter === 'active') {
      if (r.isTrash || r.isArchived) return false;
    } else if (filter === 'archived') {
      if (!r.isArchived || r.isTrash) return false;
    } else if (filter === 'trash') {
      if (!r.isTrash) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.targetRole?.toLowerCase().includes(q) ||
        r.targetCompany?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const trashCount = resumes.filter((r) => r.isTrash).length;
  const archivedCount = resumes.filter((r) => r.isArchived && !r.isTrash).length;
  const activeCount = resumes.filter((r) => !r.isArchived && !r.isTrash).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/90 dark:bg-[#121316]/90 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-white/[0.08] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]">
        <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-indigo-500/40 dark:via-indigo-400/50 to-transparent" />
        
        <div>
          <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Document Management</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight font-display mt-0.5">
            Resume Manager
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Manage your tailored resumes. Every template is strictly single-column and 100% ATS-safe.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setWizardModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold bg-white dark:bg-[#16171c] hover:bg-slate-50 dark:hover:bg-[#1a1b22] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] rounded-xl shadow-2xs transition-all cursor-pointer"
            title="Step-by-step guided profile builder"
          >
            <User className="w-3.5 h-3.5 text-indigo-500" />
            <span>Profile Wizard</span>
          </button>

          <button
            onClick={() => setPhotoModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/70 rounded-xl shadow-2xs transition-all cursor-pointer"
            title="Upload photo of resume for OCR parsing"
          >
            <Camera className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Upload Photo</span>
          </button>

          <button
            onClick={() => setGalleryModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold bg-white dark:bg-[#16171c] hover:bg-slate-50 dark:hover:bg-[#1a1b22] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] rounded-xl shadow-2xs transition-all cursor-pointer"
            title="Explore 10 professional ATS templates"
          >
            <Layout className="w-3.5 h-3.5 text-indigo-500" />
            <span>Templates Gallery</span>
          </button>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold bg-slate-950 hover:bg-slate-850 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Resume</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* Segmented Tabs */}
        <div className="flex space-x-1 bg-slate-100/70 dark:bg-white/[0.04] p-1 rounded-xl w-full sm:w-auto border border-slate-200/60 dark:border-white/[0.06]">
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'active' 
                ? 'bg-white dark:bg-[#16171c] text-slate-950 dark:text-white shadow-2xs border border-slate-200/60 dark:border-white/[0.08]' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Active (<span className="tabular-nums font-mono">{activeCount}</span>)
          </button>
          <button
            onClick={() => setFilter('archived')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'archived' 
                ? 'bg-white dark:bg-[#16171c] text-slate-950 dark:text-white shadow-2xs border border-slate-200/60 dark:border-white/[0.08]' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Archived (<span className="tabular-nums font-mono">{archivedCount}</span>)
          </button>
          <button
            onClick={() => setFilter('trash')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'trash' 
                ? 'bg-white dark:bg-[#16171c] text-slate-950 dark:text-white shadow-2xs border border-slate-200/60 dark:border-white/[0.08]' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Trash (<span className="tabular-nums font-mono">{trashCount}</span>)
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search resumes by title or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200/80 dark:border-white/[0.08] rounded-xl bg-white dark:bg-[#121316] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* Resumes Grid */}
      {filteredResumes.length === 0 ? (
        <div className="py-16 text-center bg-white/80 dark:bg-[#121316] rounded-3xl border border-dashed border-slate-200 dark:border-white/[0.08] p-8 space-y-3">
          <div className="size-11 rounded-2xl bg-slate-100 dark:bg-white/[0.05] text-slate-500 dark:text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display text-balance">No resumes found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-pretty">
            {filter === 'trash'
              ? 'Trash is empty.'
              : 'Create a tailored ATS-compliant resume to begin.'}
          </p>
          {filter === 'active' && (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="mt-2 px-4 py-2 text-xs font-bold bg-slate-950 hover:bg-slate-850 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Create Resume Now
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume) => {
            const atsResult = ATSAnalyzer.analyze(resume);

            return (
              <div
                key={resume.id}
                className="bg-white/90 dark:bg-[#121316] rounded-2xl border border-slate-200/80 dark:border-white/[0.07] hover:border-slate-300 dark:hover:border-white/[0.15] transition-all p-5 flex flex-col justify-between space-y-4 shadow-2xs group"
              >
                {/* Header */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start gap-2">
                    <h2 className="font-bold text-sm text-slate-900 dark:text-white leading-snug line-clamp-1 font-display">
                      {resume.title}
                    </h2>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 rounded font-semibold shrink-0 border border-transparent dark:border-white/[0.08]">
                      v{resume.meta.version}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-mono uppercase font-bold text-[10px] px-1.5 py-0.2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 rounded border border-indigo-200/70 dark:border-indigo-800/60">
                      {resume.meta.template}
                    </span>
                    <span>•</span>
                    <span className="truncate">{resume.targetRole || 'Generalist'}</span>
                  </div>
                </div>

                {/* ATS Score Indicator */}
                <div className="bg-slate-50/70 dark:bg-white/[0.03] p-3 rounded-xl border border-slate-100 dark:border-white/[0.05] space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>ATS Compatibility</span>
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold tabular-nums">
                      {atsResult.overallScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200/80 dark:bg-white/[0.08] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${atsResult.overallScore}%` }}
                    />
                  </div>
                </div>

                {/* Dates & Actions */}
                <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                    Modified: {new Date(resume.updatedAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center space-x-1">
                    {filter === 'trash' ? (
                      <>
                        <button
                          onClick={() => restoreFromTrash(resume.id)}
                          title="Restore from trash"
                          aria-label="Restore from trash"
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Permanently delete this resume? This cannot be undone.')) {
                              deletePermanently(resume.id);
                            }
                          }}
                          title="Delete permanently"
                          aria-label="Delete permanently"
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => duplicateResume(resume.id)}
                          title="Duplicate resume"
                          aria-label="Duplicate resume"
                          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => moveToTrash(resume.id)}
                          title="Move to trash"
                          aria-label="Move to trash"
                          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <Link
                          to={`/editor/${resume.id}`}
                          className="px-3 py-1.5 text-xs font-semibold bg-slate-950 hover:bg-slate-850 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 rounded-lg transition-colors shadow-2xs ml-1 cursor-pointer"
                        >
                          Edit
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
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
