import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  History, 
  Save, 
  Trash2, 
  Check,
  Building2,
  Calendar,
  DollarSign,
  User,
  Mail
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useToast } from '../components/common/Toast';
import { JobApplication, ApplicationStatus } from '../types';
import { SnapshotViewer } from '../components/application/SnapshotViewer';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { applications, saveApplication, deleteApplication } = useWorkspace();
  const { showToast } = useToast();

  const application = applications.find((a) => a.id === id);

  const [snapshotOpen, setSnapshotOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [status, setStatus] = useState<ApplicationStatus>(application?.status || 'Interested');
  const [notes, setNotes] = useState(application?.notes || '');
  const [interviewDate, setInterviewDate] = useState(application?.interviewDate || '');
  const [contactName, setContactName] = useState(application?.contactName || '');
  const [contactEmail, setContactEmail] = useState(application?.contactEmail || '');
  const [salary, setSalary] = useState(application?.salary || '');
  const [savedNotice, setSavedNotice] = useState(false);

  if (!application) {
    return (
      <div className="py-24 text-center text-xs text-slate-500 dark:text-slate-400 space-y-3">
        <Building2 className="size-10 text-slate-300 dark:text-slate-600 mx-auto" />
        <p className="text-sm font-semibold text-slate-900 dark:text-white">Application record not found.</p>
        <Link to="/applications" className="text-indigo-600 dark:text-indigo-400 underline font-bold inline-block">
          Return to applications pipeline
        </Link>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: JobApplication = {
      ...application,
      status,
      notes,
      interviewDate: interviewDate || undefined,
      contactName: contactName || undefined,
      contactEmail: contactEmail || undefined,
      salary: salary || undefined,
      updatedAt: new Date().toISOString(),
    };
    saveApplication(updated);
    setSavedNotice(true);
    showToast('Application updated successfully!', 'success');
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleConfirmDelete = () => {
    deleteApplication(application.id);
    showToast(`Deleted application for ${application.company}`, 'info');
    navigate('/applications');
  };

  const statusColors: Record<ApplicationStatus, string> = {
    Interested: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/60',
    Preparing: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200/60 dark:border-sky-800/60',
    Applied: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/60',
    Assessment: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/60',
    Interview: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/60',
    Offer: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60',
    Rejected: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/60',
    Withdrawn: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/applications"
          className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </Link>

        <button
          type="button"
          onClick={() => setDeleteConfirmOpen(true)}
          className="flex items-center space-x-1.5 text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 font-semibold px-3 py-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Application</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Application details updated successfully!</span>
        </div>
      )}

      {/* Main Details Card */}
      <div className="bg-white dark:bg-[#111218] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-5 border-b border-slate-100 dark:border-white/[0.06]">
          <div className="space-y-1">
            <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold border ${statusColors[application.status] || statusColors.Interested}`}>
              {application.status}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white font-display mt-1">
              {application.company}
            </h1>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {application.role}
            </p>
            {application.jobUrl && (
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center space-x-1 mt-1"
              >
                <span>Job Posting Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Immutable Snapshot Box */}
          <div className="bg-slate-50 dark:bg-[#161720] p-4 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] text-xs space-y-2.5 w-full sm:w-80 shrink-0">
            <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white">
              <History className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Submission Snapshot</span>
            </div>
            {application.resumeSnapshot ? (
              <>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Immutable version <strong>v{application.resumeVersion || '1.0'}</strong> preserved upon application.
                </p>
                <button
                  type="button"
                  onClick={() => setSnapshotOpen(true)}
                  className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
                >
                  View Historical Snapshot
                </button>
              </>
            ) : (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                A snapshot will be created automatically when this application is marked "Applied".
              </p>
            )}
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Stage / Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-white/[0.08] rounded-xl bg-slate-50 dark:bg-[#161720] text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {[
                  'Interested',
                  'Preparing',
                  'Applied',
                  'Assessment',
                  'Interview',
                  'Offer',
                  'Rejected',
                  'Withdrawn',
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Interview Date & Time
              </label>
              <div className="relative">
                <Calendar className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  placeholder="e.g. 2026-10-24 14:00 PST"
                  className="w-full text-xs pl-8 pr-3 py-2.5 border border-slate-200 dark:border-white/[0.08] rounded-xl bg-slate-50 dark:bg-[#161720] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Compensation / Stipend
              </label>
              <div className="relative">
                <DollarSign className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. $55/hr + housing"
                  className="w-full text-xs pl-8 pr-3 py-2.5 border border-slate-200 dark:border-white/[0.08] rounded-xl bg-slate-50 dark:bg-[#161720] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Recruiter / Contact Name
              </label>
              <div className="relative">
                <User className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Recruiter Name"
                  className="w-full text-xs pl-8 pr-3 py-2.5 border border-slate-200 dark:border-white/[0.08] rounded-xl bg-slate-50 dark:bg-[#161720] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Contact Email
              </label>
              <div className="relative">
                <Mail className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="recruiter@company.com"
                  className="w-full text-xs pl-8 pr-3 py-2.5 border border-slate-200 dark:border-white/[0.08] rounded-xl bg-slate-50 dark:bg-[#161720] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Interview Notes & Preparation
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record technical questions, coding challenge feedback, system design topics, and follow-up dates..."
              className="w-full text-xs p-3 border border-slate-200 dark:border-white/[0.08] rounded-2xl bg-slate-50 dark:bg-[#161720] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-white/[0.06]">
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Snapshot Viewer Modal */}
      {application && (
        <SnapshotViewer
          application={application}
          isOpen={snapshotOpen}
          onClose={() => setSnapshotOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        title="Delete Application"
        message={`Are you sure you want to delete the application record for ${application.company} (${application.role})? This will also remove any associated historical submission snapshots.`}
        confirmLabel="Delete Application"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
};
