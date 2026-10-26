import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  History, 
  Save, 
  Trash2, 
  Check 
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { JobApplication, ApplicationStatus } from '../types';
import { SnapshotViewer } from '../components/application/SnapshotViewer';

export const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { applications, saveApplication, deleteApplication } = useWorkspace();

  const application = applications.find((a) => a.id === id);

  const [snapshotOpen, setSnapshotOpen] = useState(false);
  const [status, setStatus] = useState<ApplicationStatus>(application?.status || 'Interested');
  const [notes, setNotes] = useState(application?.notes || '');
  const [interviewDate, setInterviewDate] = useState(application?.interviewDate || '');
  const [contactName, setContactName] = useState(application?.contactName || '');
  const [contactEmail, setContactEmail] = useState(application?.contactEmail || '');
  const [salary, setSalary] = useState(application?.salary || '');
  const [savedNotice, setSavedNotice] = useState(false);

  if (!application) {
    return (
      <div className="py-20 text-center text-xs text-forge-600">
        Application not found. <Link to="/applications" className="underline font-bold">Return to applications</Link>
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
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleDelete = () => {
    if (confirm(`Delete application for ${application.company}?`)) {
      deleteApplication(application.id);
      navigate('/applications');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-left space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/applications"
          className="flex items-center space-x-1.5 text-xs font-semibold text-forge-600 hover:text-forge-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </Link>

        <button
          onClick={handleDelete}
          className="flex items-center space-x-1 text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded hover:bg-rose-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Application</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Application details updated successfully!</span>
        </div>
      )}

      {/* Main Details Card */}
      <div className="bg-white p-6 rounded-2xl border border-forge-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-forge-100">
          <div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-800">
              {application.status}
            </span>
            <h1 className="text-2xl font-black text-forge-900 mt-1">{application.company}</h1>
            <p className="text-sm font-semibold text-forge-700">{application.role}</p>
            {application.jobUrl && (
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:underline inline-flex items-center space-x-1 mt-1"
              >
                <span>Job Posting Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Immutable Snapshot Box (Section 32) */}
          <div className="bg-forge-50 p-4 rounded-xl border border-forge-200 text-xs space-y-2 w-full sm:w-72">
            <div className="flex items-center space-x-1.5 font-bold text-forge-900">
              <History className="w-4 h-4 text-emerald-600" />
              <span>Submission Snapshot</span>
            </div>
            {application.resumeSnapshot ? (
              <>
                <p className="text-[11px] text-forge-500">
                  Immutable version <strong>v{application.resumeVersion || '1.0'}</strong> preserved upon application.
                </p>
                <button
                  onClick={() => setSnapshotOpen(true)}
                  className="w-full py-1.5 px-3 bg-forge-900 text-white font-semibold rounded-lg hover:bg-forge-800 text-xs shadow-sm"
                >
                  View Historical Snapshot
                </button>
              </>
            ) : (
              <p className="text-[11px] text-forge-500">
                A snapshot will be created automatically when this application is marked "Applied".
              </p>
            )}
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-forge-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="w-full p-2 border border-forge-300 rounded bg-white font-semibold"
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
              <label className="block font-semibold text-forge-700 mb-1">Interview Date & Time</label>
              <input
                type="text"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                placeholder="e.g. 2026-10-24 14:00 PST"
                className="w-full p-2 border border-forge-300 rounded bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-forge-700 mb-1">Compensation / Stipend</label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. $55/hr + housing"
                className="w-full p-2 border border-forge-300 rounded bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-forge-700 mb-1">Recruiter / Contact Name</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Recruiter Name"
                className="w-full p-2 border border-forge-300 rounded bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-forge-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="recruiter@company.com"
                className="w-full p-2 border border-forge-300 rounded bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-forge-700 mb-1">Interview Notes & Prep</label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record technical questions, coding challenge feedback, system design topics, and follow-up dates..."
              className="w-full p-3 border border-forge-300 rounded bg-white text-xs"
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-forge-100">
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 bg-forge-900 text-white font-bold rounded-lg hover:bg-forge-800 transition-colors shadow-sm"
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
    </div>
  );
};
