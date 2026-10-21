import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Calendar,
  X, 
  History,
  Briefcase,
  ExternalLink,
  ChevronRight
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

  // Analytics calculation
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
      {/* Header Banner */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/90 dark:bg-[#121316]/90 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-white/[0.08] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]">
        <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-indigo-500/40 dark:via-indigo-400/50 to-transparent" />
        
        <div>
          <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pipeline Intelligence</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight font-display mt-0.5 text-balance">
            Application Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium text-pretty">
            Track interview pipelines with immutable resume snapshots preserved upon submission.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 text-xs font-bold bg-slate-950 hover:bg-slate-850 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Application</span>
        </button>
      </div>

      {/* Analytics 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/90 dark:bg-[#121316] p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-1">
          <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Tracked</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tabular-nums font-display">{total}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Applications logged</div>
        </div>

        <div className="bg-white/90 dark:bg-[#121316] p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-1">
          <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Submitted</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tabular-nums font-display">{appliedCount}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Past preparation stage</div>
        </div>

        <div className="bg-white/90 dark:bg-[#121316] p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-1">
          <div className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Interview Rate</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums font-display">{interviewRate}%</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">{interviewCount} rounds reached</div>
        </div>

        <div className="bg-white/90 dark:bg-[#121316] p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-1">
          <div className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Offers Received</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums font-display">{offerCount}</div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Offer rate: {offerRate}%</div>
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-1 bg-slate-100/70 dark:bg-white/[0.04] p-1 rounded-xl border border-slate-200/60 dark:border-white/[0.06]">
          <button
            onClick={() => setActiveView('kanban')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'kanban' 
                ? 'bg-white dark:bg-[#16171c] text-slate-950 dark:text-white shadow-2xs border border-slate-200/60 dark:border-white/[0.08]' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setActiveView('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'table' 
                ? 'bg-white dark:bg-[#16171c] text-slate-950 dark:text-white shadow-2xs border border-slate-200/60 dark:border-white/[0.08]' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
              <div key={colStatus} className="bg-slate-100/60 dark:bg-[#16171c]/70 p-3 rounded-2xl min-w-[210px] flex flex-col border border-slate-200/60 dark:border-white/[0.06]">
                <div className="flex justify-between items-center mb-3 px-1">
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{colStatus}</span>
                  <span className="text-[10px] font-mono font-bold bg-white dark:bg-[#202128] text-slate-700 dark:text-slate-300 px-1.5 py-0.2 rounded-full border border-slate-200 dark:border-white/[0.08] tabular-nums">
                    {appsInCol.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1">
                  {appsInCol.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white dark:bg-[#1e1f25] p-3 rounded-xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xs hover:border-slate-300 dark:hover:border-white/[0.15] transition-all space-y-2"
                    >
                      <div>
                        <Link
                          to={`/applications/${app.id}`}
                          className="font-bold text-xs text-slate-900 dark:text-white hover:underline block font-display"
                        >
                          {app.company}
                        </Link>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{app.role}</div>
                      </div>

                      {app.deadline && (
                        <div className="text-[10px] text-amber-700 dark:text-amber-400 flex items-center space-x-1 font-mono">
                          <Calendar className="w-3 h-3 text-amber-500" />
                          <span>Due: {app.deadline}</span>
                        </div>
                      )}

                      {/* Snapshot Indicator */}
                      {app.resumeSnapshot && (
                        <button
                          onClick={() => setSelectedSnapshotApp(app)}
                          className="w-full text-[10px] font-mono font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/60 p-1 rounded-lg flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                        >
                          <History className="w-3 h-3 text-emerald-500" />
                          <span>View Snapshot</span>
                        </button>
                      )}

                      {/* Move status select */}
                      <div className="pt-1.5 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app, e.target.value as ApplicationStatus)}
                          className="text-[10px] p-1 border border-slate-200 dark:border-white/[0.08] rounded-md bg-slate-50 dark:bg-[#121316] text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
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
        <div className="bg-white/90 dark:bg-[#121316] rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 dark:bg-white/[0.03] border-b border-slate-200/80 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 font-mono font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Company</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Deadline</th>
                <th className="p-3.5">Submitted Snapshot</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                    No applications logged yet. Click "New Application" to add your first job.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white font-display">
                      <Link to={`/applications/${app.id}`} className="hover:underline">
                        {app.company}
                      </Link>
                    </td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300">{app.role}</td>
                    <td className="p-3.5">
                      <span className="font-mono font-semibold px-2 py-0.5 rounded-full text-[10px] uppercase bg-slate-100 dark:bg-white/[0.06] text-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-white/[0.08]">
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400 font-mono text-[11px] tabular-nums">{app.deadline || '—'}</td>
                    <td className="p-3.5">
                      {app.resumeSnapshot ? (
                        <button
                          onClick={() => setSelectedSnapshotApp(app)}
                          className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center space-x-1 cursor-pointer"
                        >
                          <History className="w-3 h-3 text-emerald-500" />
                          <span>v{app.resumeVersion || '1.0'} Snapshot</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 text-[11px]">Pending submission</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <Link
                        to={`/applications/${app.id}`}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
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
          <div className="bg-white dark:bg-[#121316] rounded-2xl shadow-2xl max-w-lg w-full p-6 text-left border border-slate-200/80 dark:border-white/[0.08]">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-white/[0.06] mb-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white font-display">Track New Job Application</h2>
              <button 
                onClick={() => setShowNewModal(false)} 
                aria-label="Close dialog"
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateApplication} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. Stripe, Datadog"
                  className="w-full p-2.5 border border-slate-300 dark:border-white/[0.08] rounded-xl bg-white dark:bg-[#18191f] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. Software Engineering Intern"
                  className="w-full p-2.5 border border-slate-300 dark:border-white/[0.08] rounded-xl bg-white dark:bg-[#18191f] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                    className="w-full p-2.5 border border-slate-300 dark:border-white/[0.08] rounded-xl bg-white dark:bg-[#18191f] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {STATUS_COLUMNS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 dark:border-white/[0.08] rounded-xl bg-white dark:bg-[#18191f] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Resume to Use</label>
                <select
                  value={newResumeId}
                  onChange={(e) => setNewResumeId(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 dark:border-white/[0.08] rounded-xl bg-white dark:bg-[#18191f] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Interview questions, recruiter contacts, or referral details..."
                  className="w-full p-2.5 border border-slate-300 dark:border-white/[0.08] rounded-xl bg-white dark:bg-[#18191f] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3.5 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-850 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Snapshot Viewer Modal */}
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
