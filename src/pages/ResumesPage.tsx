import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Copy, 
  Trash2, 
  Archive, 
  RotateCcw, 
  ExternalLink, 
  Search, 
  FileCheck, 
  MoreVertical, 
  Edit3 
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { ATSAnalyzer } from '../lib/atsAnalyzer';
import { CreateResumeModal } from '../components/profile/CreateResumeModal';

export const ResumesPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    resumes, 
    duplicateResume, 
    moveToTrash, 
    restoreFromTrash, 
    deletePermanently, 
    createResume 
  } = useWorkspace();

  const [filter, setFilter] = useState<'active' | 'archived' | 'trash'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-forge-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-forge-900 dark:text-white tracking-tight">Resume Manager</h1>
          <p className="text-xs text-forge-500 dark:text-slate-400 mt-0.5">
            Manage your tailored resumes. Every template is strictly single-column and ATS-safe.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Resume</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* Tabs */}
        <div className="flex space-x-1 bg-forge-100 dark:bg-slate-800/80 p-1 rounded-lg w-full sm:w-auto border border-transparent dark:border-slate-700/60">
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              filter === 'active' ? 'bg-white dark:bg-slate-900 text-forge-900 dark:text-white shadow-xs' : 'text-forge-600 dark:text-slate-400 hover:text-forge-900 dark:hover:text-white'
            }`}
          >
            Active (<span className="tabular-nums">{activeCount}</span>)
          </button>
          <button
            onClick={() => setFilter('archived')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              filter === 'archived' ? 'bg-white dark:bg-slate-900 text-forge-900 dark:text-white shadow-xs' : 'text-forge-600 dark:text-slate-400 hover:text-forge-900 dark:hover:text-white'
            }`}
          >
            Archived (<span className="tabular-nums">{archivedCount}</span>)
          </button>
          <button
            onClick={() => setFilter('trash')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              filter === 'trash' ? 'bg-white dark:bg-slate-900 text-forge-900 dark:text-white shadow-xs' : 'text-forge-600 dark:text-slate-400 hover:text-forge-900 dark:hover:text-white'
            }`}
          >
            Trash (<span className="tabular-nums">{trashCount}</span>)
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-forge-400 dark:text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search resumes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 border border-forge-200 dark:border-slate-700/80 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Resumes Grid */}
      {filteredResumes.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900/60 rounded-2xl border border-forge-200 dark:border-slate-800 p-8 space-y-3">
          <FileText className="size-10 text-forge-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-forge-800 dark:text-white text-balance">No resumes found</h3>
          <p className="text-xs text-forge-500 dark:text-slate-400 max-w-sm mx-auto text-pretty">
            {filter === 'trash'
              ? 'Trash is empty.'
              : 'Create a tailored ATS-compliant resume.'}
          </p>
          {filter === 'active' && (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="mt-2 px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm transition-all"
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
                className="bg-white dark:bg-slate-900/90 rounded-2xl border border-forge-200 dark:border-slate-800 hover:border-forge-300 dark:hover:border-slate-700 transition-all p-5 flex flex-col justify-between space-y-4 shadow-xs"
              >
                {/* Header */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start gap-2">
                    <h2 className="font-bold text-sm text-forge-900 dark:text-white leading-snug line-clamp-1">
                      {resume.title}
                    </h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-forge-100 dark:bg-slate-800 text-forge-700 dark:text-slate-300 rounded font-semibold shrink-0">
                      v{resume.meta.version}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-forge-500 dark:text-slate-400">
                    <span className="font-mono uppercase font-bold text-[10px] px-1.5 py-0.2 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-900/60">
                      {resume.meta.template}
                    </span>
                    <span>•</span>
                    <span className="truncate">{resume.targetRole || 'Generalist'}</span>
                  </div>
                </div>

                {/* ATS Score Indicator */}
                <div className="bg-forge-50 dark:bg-slate-800/60 p-3 rounded-xl border border-forge-100 dark:border-slate-800/80 space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-forge-700 dark:text-slate-300 flex items-center space-x-1">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>ATS Compatibility</span>
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-mono">{atsResult.overallScore}%</span>
                  </div>
                  <div className="w-full bg-forge-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 dark:bg-emerald-400 h-1.5 rounded-full"
                      style={{ width: `${atsResult.overallScore}%` }}
                    />
                  </div>
                </div>

                {/* Dates & Actions */}
                <div className="pt-2 border-t border-forge-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-forge-400 dark:text-slate-500">
                    Modified: {new Date(resume.updatedAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center space-x-1">
                    {filter === 'trash' ? (
                      <>
                        <button
                          onClick={() => restoreFromTrash(resume.id)}
                          title="Restore from trash"
                          aria-label="Restore from trash"
                          className="p-1.5 rounded text-forge-600 dark:text-slate-400 hover:text-forge-900 dark:hover:text-white hover:bg-forge-100 dark:hover:bg-slate-800"
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
                          className="p-1.5 rounded text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
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
                          className="p-1.5 rounded text-forge-500 dark:text-slate-400 hover:text-forge-900 dark:hover:text-white hover:bg-forge-100 dark:hover:bg-slate-800"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => moveToTrash(resume.id)}
                          title="Move to trash"
                          aria-label="Move to trash"
                          className="p-1.5 rounded text-forge-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <Link
                          to={`/editor/${resume.id}`}
                          className="px-3 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-xs ml-1"
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
    </div>
  );
};
