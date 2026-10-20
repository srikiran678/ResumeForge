import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Calendar,
  X, 
  History
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWorkspace } from '../context/WorkspaceContext';
import { JobApplication, ApplicationStatus } from '../types';
import { SnapshotViewer } from '../components/application/SnapshotViewer';

const STATUS_COLUMNS: ApplicationStatus[] = [
  'Interested',
  'Preparing',
  'Applied',
  'Assessment',
  'Interview',
  'Offer',
  'Rejected',
];

export const ApplicationsPage: React.FC = () => {
  const { user } = useAuth();
  const { applications, resumes, saveApplication } = useWorkspace();

  const [activeView, setActiveView] = useState<'kanban' | 'table'>('kanban');
  const [selectedSnapshotApp, setSelectedSnapshotApp] = useState<JobApplication | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  // New Application form state
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newJobUrl, setNewJobUrl] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newResumeId, setNewResumeId] = useState(resumes[0]?.id || '');
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('Interested');
  const [newNotes, setNewNotes] = useState('');

  // Analytics calculation (Section 33)
  const total = applications.length;
  const appliedCount = applications.filter((a) =>
    ['Applied', 'Assessment', 'Interview', 'Offer', 'Rejected'].includes(a.status)
  ).length;
  const interviewCount = applications.filter((a) =>
    ['Interview', 'Offer'].includes(a.status)
  ).length;
  const offerCount = applications.filter((a) => a.status === 'Offer').length;

  const interviewRate = appliedCount > 0 ? Math.round((interviewCount / appliedCount) * 100) : 0;
  const offerRate = interviewCount > 0 ? Math.round((offerCount / interviewCount) * 100) : 0;

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const app: JobApplication = {
      id: `app_${Date.now()}`,
      userId: user?.id || '',
      company: newCompany,
      role: newRole,
      jobUrl: newJobUrl || undefined,
      location: newLocation || undefined,
      deadline: newDeadline || undefined,
      resumeId: newResumeId,
      resumeVersion: '1.0',
      status: newStatus,
      notes: newNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveApplication(app);
    setShowNewModal(false);
    setNewCompany('');
    setNewRole('');
    setNewJobUrl('');
    setNewLocation('');
    setNewDeadline('');
  };

  const handleStatusChange = (app: JobApplication, newStatus: ApplicationStatus) => {
    saveApplication({ ...app, status: newStatus });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-forge-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-forge-900 tracking-tight">
            Application Tracker
          </h1>
          <p className="text-xs text-forge-500 mt-0.5">
            Track interview pipelines. When status moves to "Applied", an immutable resume snapshot is saved automatically.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold bg-forge-900 text-white hover:bg-forge-800 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Application</span>
        </button>
      </div>

      {/* Analytics Banner (Section 33) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-forge-200 shadow-sm">
          <div className="text-xs font-bold text-forge-500 uppercase tracking-wider">Total Tracked</div>
          <div className="text-2xl font-black text-forge-900 mt-1">{total}</div>
          <div className="text-[11px] text-forge-400">Applications logged</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-forge-200 shadow-sm">
          <div className="text-xs font-bold text-forge-500 uppercase tracking-wider">Submitted</div>
          <div className="text-2xl font-black text-forge-900 mt-1">{appliedCount}</div>
          <div className="text-[11px] text-forge-400">Past preparation stage</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-forge-200 shadow-sm">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">Interview Rate</div>
          <div className="text-2xl font-black text-blue-600 mt-1">{interviewRate}%</div>
          <div className="text-[11px] text-forge-400">{interviewCount} rounds reached</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-forge-200 shadow-sm">
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Offers Received</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{offerCount}</div>
          <div className="text-[11px] text-emerald-700 font-medium">Offer rate: {offerRate}%</div>
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-1 bg-forge-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveView('kanban')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeView === 'kanban' ? 'bg-white text-forge-900 shadow-sm' : 'text-forge-600'
            }`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setActiveView('table')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeView === 'table' ? 'bg-white text-forge-900 shadow-sm' : 'text-forge-600'
            }`}
          >
            Table View
          </button>
        </div>
      </div>

      {/* Kanban Board View */}
      {activeView === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3 overflow-x-auto pb-4">
          {STATUS_COLUMNS.map((colStatus) => {
            const appsInCol = applications.filter((a) => a.status === colStatus);

            return (
              <div key={colStatus} className="bg-forge-100/70 p-3 rounded-xl min-w-[200px] flex flex-col">
                <div className="flex justify-between items-center mb-3 px-1">
                  <span className="text-xs font-bold text-forge-800 uppercase tracking-wider">{colStatus}</span>
                  <span className="text-[10px] font-mono font-bold bg-white text-forge-700 px-1.5 py-0.5 rounded-full border border-forge-200">
                    {appsInCol.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1">
                  {appsInCol.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white p-3 rounded-lg border border-forge-200 shadow-xs hover:border-forge-300 transition-all space-y-2"
                    >
                      <div>
                        <Link
                          to={`/applications/${app.id}`}
                          className="font-bold text-xs text-forge-900 hover:underline block"
                        >
                          {app.company}
                        </Link>
                        <div className="text-[11px] text-forge-600 leading-snug">{app.role}</div>
                      </div>

                      {app.deadline && (
                        <div className="text-[10px] text-amber-700 flex items-center space-x-1 font-mono">
                          <Calendar className="w-3 h-3 text-amber-600" />
                          <span>Due: {app.deadline}</span>
                        </div>
                      )}

                      {/* Snapshot Indicator (Section 32) */}
                      {app.resumeSnapshot && (
                        <button
                          onClick={() => setSelectedSnapshotApp(app)}
                          className="w-full text-[10px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 p-1 rounded flex items-center justify-center space-x-1"
                        >
                          <History className="w-3 h-3 text-emerald-600" />
                          <span>View Immutable Snapshot</span>
                        </button>
                      )}

                      {/* Move status select */}
                      <div className="pt-1 border-t border-forge-100 flex items-center justify-between">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app, e.target.value as ApplicationStatus)}
                          className="text-[10px] p-1 border border-forge-200 rounded bg-forge-50 text-forge-700 focus:outline-none"
                        >
                          {STATUS_COLUMNS.map((s) => (
                            <option key={s} value={s}>
                              Move: {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {activeView === 'table' && (
        <div className="bg-white rounded-xl border border-forge-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-forge-50 border-b border-forge-200 text-forge-700 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Company</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Deadline</th>
                <th className="p-3">Submitted Snapshot</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forge-100">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-forge-500">
                    No applications logged yet. Click "New Application" to add your first job.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-forge-50/50">
                    <td className="p-3 font-bold text-forge-900">
                      <Link to={`/applications/${app.id}`} className="hover:underline">
                        {app.company}
                      </Link>
                    </td>
                    <td className="p-3 text-forge-700">{app.role}</td>
                    <td className="p-3">
                      <span className="font-semibold px-2 py-0.5 rounded-full text-[10px] uppercase bg-forge-100 text-forge-800">
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3 text-forge-600 font-mono text-[11px]">{app.deadline || '—'}</td>
                    <td className="p-3">
                      {app.resumeSnapshot ? (
                        <button
                          onClick={() => setSelectedSnapshotApp(app)}
                          className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center space-x-1"
                        >
                          <History className="w-3 h-3 text-emerald-600" />
                          <span>v{app.resumeVersion || '1.0'} Snapshot</span>
                        </button>
                      ) : (
                        <span className="text-forge-400 text-[11px]">Pending submission</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        to={`/applications/${app.id}`}
                        className="text-xs font-semibold text-forge-900 hover:underline"
                      >
                        Details →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* New Application Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 text-left border border-forge-200">
            <div className="flex justify-between items-center pb-3 border-b border-forge-100 mb-4">
              <h2 className="text-sm font-bold text-forge-900">Track New Job Application</h2>
              <button onClick={() => setShowNewModal(false)} className="text-forge-400 hover:text-forge-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateApplication} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-forge-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. Stripe, Datadog"
                  className="w-full p-2 border border-forge-300 rounded bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-forge-700 mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. Software Engineering Intern"
                  className="w-full p-2 border border-forge-300 rounded bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-forge-700 mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                    className="w-full p-2 border border-forge-300 rounded bg-white"
                  >
                    {STATUS_COLUMNS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-forge-700 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full p-2 border border-forge-300 rounded bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-forge-700 mb-1">Resume to Use</label>
                <select
                  value={newResumeId}
                  onChange={(e) => setNewResumeId(e.target.value)}
                  className="w-full p-2 border border-forge-300 rounded bg-white"
                >
                  <option value="">No resume selected / general</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} (v{r.meta.version})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-forge-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Interview questions, recruiter contacts, or referral details..."
                  className="w-full p-2 border border-forge-300 rounded bg-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-forge-100">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-1.5 text-forge-600 hover:text-forge-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-forge-900 text-white font-bold rounded-lg hover:bg-forge-800"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Snapshot Viewer Modal (Section 32) */}
      {selectedSnapshotApp && (
        <SnapshotViewer
          application={selectedSnapshotApp}
          isOpen={Boolean(selectedSnapshotApp)}
          onClose={() => setSelectedSnapshotApp(null)}
        />
      )}
    </div>
  );
};
